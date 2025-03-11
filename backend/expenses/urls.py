from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.expense_list_create, name='expense-list-create'),
    path('expenses/<int:pk>/', views.expense_detail, name='expense-detail'),
    path('categories/', views.category_list_create, name='category-list-create'),
] 