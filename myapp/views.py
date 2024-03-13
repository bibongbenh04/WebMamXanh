from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User, auth
from django.contrib.auth.decorators import login_required
from django.contrib import messages as django_messages
from .models import Feature, QuizQuestion
from django.core.serializers import serialize
from django.utils.translation import gettext as _

# Create your views here.
def index(request):
	features = Feature.objects.all()
	return render(request, 'index.html', {'features' : features})

def dictionaryEL(request):
	return render(request, 'themes/dictionaryEnglish.html')

def quiz(request):
    questions = QuizQuestion.objects.all()
    questions_list = [
        {
            'question_text': question.question_text,
            'option1': question.choice1,
            'option2': question.choice2,
            'option3': question.choice3,
            'option4': question.choice4,
            'correctChoice': question.correct_choice,
        }
        for question in questions
    ]
    data = {'questions': questions_list}
    
    return render(request, 'quiz.html', {'questions_data': data})
	
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
	if request.method == 'POST':
		username = request.POST['username']
		email = request.POST['email']
		password = request.POST['password']
		password2 = request.POST['confirm_password']

		if password == password2:
			if User.objects.filter(email=email).exists():
				django_messages.info(request, 'Email Already Used')
				return redirect('signup')
			elif User.objects.filter(username=username).exists():
				django_messages.info(request, 'Username Already Used')
				return redirect('signup')
			else:
				user = User.objects.create_user(username=username, email=email, password=password)
				user.save()
				return redirect('login')
		else:
			django_messages.info(request, 'Password Not The Same')
			return redirect('signup')
	else:
		return render(request, 'themes/signup.html')

def post(request, pk):
	return render(request, 'post.html', {'pk': pk})