from flask import Flask, jsonify, request
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import mediapipe as mp # Import mediapipe
import cv2 # Import opencv
import pandas as pd
import pickle
from flask_cors import CORS, cross_origin
from translate import Translator
translator= Translator(to_lang="Hindi")




app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def hello_world():
   return "Hello World"

@app.route('/api', methods=['POST'])
@cross_origin()
def api():
	req = request.get_json(force=True)
	row = []
	for i in range(42):
		row.append(req['x'][i])
		row.append(req['y'][i])
		row.append(req['z'][i])

	allNone = True
	for i in row:
		if i != -2:
			allNone = False

	if not allNone:
		with open('body_language046.pkl', 'rb') as f:
			model = pickle.load(f)
		X = pd.DataFrame([row])
		body_language_class = model.predict(X)[0]
		body_language_prob = model.predict_proba(X)[0]
		result = {}
		result['class'] = body_language_class
		result['probability'] = body_language_prob.tolist()
		response = {}
		response['success'] = True
		response['result'] = result
		return jsonify(response)
	else:
		result['class'] = 'No sign detected'
		result['probability'] = [0]
		response = {}
		response['success'] = True
		response['result'] = result
		return jsonify(response)

@app.route('/apiHindi', methods=['POST'])
@cross_origin()
def apiHindi():
	req = request.get_json(force=True)
	row = []
	for i in range(42):
		row.append(req['x'][i])
		row.append(req['y'][i])
		row.append(req['z'][i])

	allNone = True
	for i in row:
		if i != -2:
			allNone = False

	if not allNone:
		with open('body_language046.pkl', 'rb') as f:
			model = pickle.load(f)
		X = pd.DataFrame([row])
		body_language_class = model.predict(X)[0]
		body_language_prob = model.predict_proba(X)[0]
		result = {}
		translation = translator.translate(body_language_class)
		result['class'] = translation
		result['probability'] = body_language_prob.tolist()
		response = {}
		response['success'] = True
		response['result'] = result
		return jsonify(response)
	else:
		result['class'] = 'No sign detected'
		result['probability'] = [0]
		response = {}
		response['success'] = True
		response['result'] = result
		return jsonify(response)


if __name__ == '__main__':
   app.run()


	# if(len(req['x']) > 42):
	# 	for i in range(len(req['x'])):
	# 		row.append(req['x'][i])
	# 		row.append(req['y'][i])
	# 		row.append(req['z'][i])
	# 		row.append(req['v'][i])
	# else:
	# 	zero = [0 for i in range(127-len(req['x']))]
	# 	req['x'] = req['x'] + zero
	# 	req['y'] = req['y'] + zero
	# 	req['z'] = req['z'] + zero
	# 	req['v'] = req['v'] + zero
	# 	for i in range(len(req['x'])):
	# 		row.append(req['x'][i])
	# 		row.append(req['y'][i])
	# 		row.append(req['z'][i])
	# 		row.append(req['v'][i])
