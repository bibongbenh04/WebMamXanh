from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, auth
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Feature, QuizQuestion, ThreadManager, Thread
from myapp.models import Thread

# Create your views here.
def index(request):
	features = Feature.objects.all()
	return render(request, 'index.html', {'features' : features})

@login_required
def messages(request):
    threads = Thread.objects.by_user(user=request.user).prefetch_related('chatmessage_thread').order_by('timestamp')
    context = {
        'Threads': threads,
    }
    return render(request, 'messages.html', context)

def quiz(request):
	
    context = {
        'questions': QuizQuestion.objects.all(),
        'id_ques': 0,
    }

    return render(request, 'quiz.html', context)
	
def login(request):
	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']

		user = auth.authenticate(username=username, password=password)

		if user is not None:
			auth.login(request, user)
			return redirect('/')
		else:
			messages.info(request, 'Credentials Invalid')
			return redirect('login')
	else:
		return render(request, 'themes/login.html')

def logout(request):
	auth.logout(request)
	return redirect('/')

def signup(request):
	return render(request, 'themes/signup.html')

def register(request):
	if request.method == 'POST':
		username = request.POST['username']
		email = request.POST['email']
		password = request.POST['password']
		password2 = request.POST['password2']

		if password == password2:
			if User.objects.filter(email=email).exists():
				messages.info(request, 'Email Already Used')
				return redirect('register')
			elif User.objects.filter(username=username).exists():
				messages.info(request, 'Username Already Used')
				return redirect('register')
			else:
				user = User.objects.create_user(username=username, email=email, password=password)
				user.save()
				return redirect('login')
		else:
			messages.info(request, 'Password Not The Same')
			return redirect('register')
	else:
		return render(request, 'register.html')

def post(request, pk):
	return render(request, 'post.html', {'pk': pk})