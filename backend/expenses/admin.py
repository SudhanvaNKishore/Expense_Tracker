from django.contrib import admin
from .models import Expense, Category

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'amount', 'category', 'user', 'date', 'created_at')
    list_filter = ('category', 'user', 'date')
    search_fields = ('title', 'description', 'user__email')
    ordering = ('-date', '-created_at')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)
    search_fields = ('name', 'user__email')
