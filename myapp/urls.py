from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
	path('', views.index, name = 'index'),
	path('login', views.login, name = 'login'),
	path('accounts/login/', views.login, name = 'login'),
	path('signup', views.signup, name = 'signup'),
	path('logout', views.logout, name = 'logout'),
	path('quiz', views.quiz, name = 'quiz'),
	path('post/<str:pk>', views.post, name = 'post'),
	path('dictionaryEL', views.dictionaryEL, name = 'dictionaryEL'),
]+static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)