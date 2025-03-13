from rest_framework import serializers
from .models import Expense, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ['id']

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.CharField(write_only=True)  # Accept category name as string
    
    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'date', 'category', 'category_name', 'description']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        category_name = validated_data.pop('category')
        user = self.context['request'].user
        
        # Get or create the category
        category, _ = Category.objects.get_or_create(
            name=category_name,
            user=user
        )
        
        # Create the expense with the category
        expense = Expense.objects.create(
            category=category,
            user=user,
            **validated_data
        )
        return expense 