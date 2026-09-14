import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Categories, CategoryItem } from '../constants/categories';
import { Colors, Typography } from '../constants/theme';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelect: (catId: string) => void;
  showAllOption?: boolean;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelect,
  showAllOption = true,
}) => {
  const items = showAllOption
    ? [{ id: 'All', name: 'All Services', icon: 'grid', color: Colors.primary, bg: Colors.primaryLight }, ...Categories]
    : Categories;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {items.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                isSelected ? { backgroundColor: Colors.primary } : { backgroundColor: Colors.white },
              ]}
              onPress={() => onSelect(cat.id)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textMedium,
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
});
