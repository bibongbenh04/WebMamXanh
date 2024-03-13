from django.contrib import admin
from django import forms
from .models import QuizQuestion, Category, Post
from django.core.exceptions import ValidationError
from django.db.models import Q
# Register your models here.

admin.site.register(QuizQuestion)
admin.site.register(Category)
admin.site.register(Post)
