from django.urls import path
from . import views
urlpatterns = [
	path('', views.index, name = 'index'),
	path('login', views.login, name = 'login'),
	path('signup', views.signup, name = 'signup'),
	path('logout', views.logout, name = 'logout'),
	path('quiz', views.quiz, name = 'quiz'),
	path('post/<str:pk>', views.post, name = 'post'),
	path('chat/', views.messages, name = 'messages'),
]