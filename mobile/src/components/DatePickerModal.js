import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";

function atStartOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function clampByRange(date, minDate, maxDate) {
  if (minDate && date < atStartOfDay(minDate)) return atStartOfDay(minDate);
  if (maxDate && date > atStartOfDay(maxDate)) return atStartOfDay(maxDate);
  return date;
}

function addMonths(base, delta) {
  const d = new Date(base.getFullYear(), base.getMonth() + delta, 1);
  return d;
}

function getMonthMatrix(year, month, weekStartsOn = 0 /* 0=Sun ... 6=Sat */) {
  // First day of month
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build leading blanks
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  // Month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  // Pad to full rows of 7
  while (cells.length % 7 !== 0) cells.push(null);

  // Chunk to weeks
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function DatePickerModal({
  visible,
  value, // Date | undefined
  onConfirm, // (date: Date) => void
  onCancel, // () => void
  onBackdropPress, // optional: () => void
  titleFormatter, // optional: (year:number, month:number) => string
  weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  confirmText = "Done",
  showTodayBadge = true,
  weekStartsOn = 0, // 0: Sunday, 1: Monday ...
  minDate, // Date | undefined
  maxDate, // Date | undefined
}) {
  const today = useMemo(() => atStartOfDay(new Date()), []);
  const initial = useMemo(() => atStartOfDay(value ?? today), [value, today]);
  const [cursor, setCursor] = useState(
    clampByRange(
      new Date(initial.getFullYear(), initial.getMonth(), 1),
      minDate,
      maxDate
    )
  );
  const [selected, setSelected] = useState(initial);

  // Regenerate month matrix when cursor changes
  const matrix = useMemo(
    () => getMonthMatrix(cursor.getFullYear(), cursor.getMonth(), weekStartsOn),
    [cursor, weekStartsOn]
  );

  const defaultTitle = `${cursor.getFullYear()}年${String(
    cursor.getMonth() + 1
  ).padStart(2, "0")}月`;
  const headerTitle = titleFormatter
    ? titleFormatter(cursor.getFullYear(), cursor.getMonth() + 1)
    : defaultTitle;

  function canGoPrev() {
    if (!minDate) return true;
    const prev = addMonths(cursor, -1);
    const lastOfPrev = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
    return atStartOfDay(lastOfPrev) >= atStartOfDay(minDate);
  }
  function canGoNext() {
    if (!maxDate) return true;
    const next = addMonths(cursor, 1);
    const firstOfNext = new Date(next.getFullYear(), next.getMonth(), 1);
    return atStartOfDay(firstOfNext) <= atStartOfDay(maxDate);
  }

  function isDisabledDate(d) {
    if (!d) return true;
    if (minDate && atStartOfDay(d) < atStartOfDay(minDate)) return true;
    if (maxDate && atStartOfDay(d) > atStartOfDay(maxDate)) return true;
    return false;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onBackdropPress}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Pressable
            style={{ padding: 5, alignItems: "flex-end" }}
            onPress={() => onConfirm(selected)}
          >
            <Text style={{ color: "#e8780fff", fontSize: 16 }}>完成</Text>
          </Pressable>
          <View style={styles.divider} />
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              disabled={!canGoPrev()}
              onPress={() => canGoPrev() && setCursor(addMonths(cursor, -1))}
              style={({ pressed, disabled }) => [
                styles.navBtn,
                disabled && { opacity: 0.3 },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.navText}>{"‹"}</Text>
            </Pressable>
            <Text style={styles.title}>{headerTitle}</Text>
            <Pressable
              disabled={!canGoNext()}
              onPress={() => canGoNext() && setCursor(addMonths(cursor, 1))}
              style={({ pressed, disabled }) => [
                styles.navBtn,
                disabled && { opacity: 0.3 },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.navText}>{"›"}</Text>
            </Pressable>
          </View>

          {/* Week labels */}
          <View style={styles.weekRow}>
            {weekLabels.map((w, idx) => (
              <Text key={idx} style={styles.weekCell}>
                {w}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <FlatList
            data={matrix}
            keyExtractor={(_, i) => `w-${i}`}
            renderItem={({ item: week, index }) => (
              <View style={styles.weekRow}>
                {week.map((d, i) => {
                  const isToday = d && isSameDay(d, today);
                  const isSelected = d && isSameDay(d, selected);
                  const disabled = isDisabledDate(d);
                  return (
                    <Pressable
                      key={i}
                      disabled={!d || disabled}
                      onPress={() => d && setSelected(d)}
                      style={({ pressed }) => [
                        styles.dayCell,
                        isSelected && styles.daySelected,
                        pressed && d && !disabled && { opacity: 0.7 },
                      ]}
                    >
                      {d ? (
                        <View style={styles.dayInner}>
                          <View
                            style={[
                              styles.dayBadge,
                              isToday && showTodayBadge && styles.todayBadge,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dayText,
                                disabled && styles.dayTextDisabled,
                                isSelected && styles.dayTextSelected,
                              ]}
                            >
                              {d.getDate()}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.dayInner} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
            scrollEnabled={false}
          />

          {/* Footer */}
          {/* <View style={styles.footer}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.btnSecondary,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(selected)}
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.btnPrimaryText}>{confirmText}</Text>
            </Pressable>
          </View> */}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const CELL = 44;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    height: 420,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  navBtn: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: { fontSize: 22, fontWeight: "500" },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  weekCell: {
    width: CELL,
    textAlign: "center",
    color: "#666",
    fontSize: 12,
  },

  dayCell: {
    width: CELL,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  dayInner: {
    width: CELL - 6,
    height: CELL - 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { fontSize: 16, color: "#111" },
  dayTextDisabled: { color: "#bbb" },
  daySelected: {
    backgroundColor: "#FFEFE2",
  },
  dayTextSelected: {
    color: "#FF7A00",
    fontWeight: "700",
  },
  todayBadge: {
    borderWidth: 1,
    borderColor: "#FF7A00",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  btnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  btnSecondaryText: { fontSize: 15, color: "#333" },

  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FF7A00",
  },
  btnPrimaryText: { fontSize: 15, color: "#fff", fontWeight: "600" },
  divider: {
    marginTop: 10,
    height: 2,
    backgroundColor: "#f9f9f9ff",
    borderRadius: 2,
  },
});
