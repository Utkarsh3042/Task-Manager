from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app,db)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {"id":self.id, "title":self.title, "description":self.description}
    
#db.create_all()

#read
@app.route('/tasks', methods=['GET'])
def get_task():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

#write
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_task = Task(title=data['title'], description=data['description'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201


#update
@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({'error':'task not found'}), 404
    data = request.json
    task.title = data['title']
    task.description = data['description']
    db.session.commit()
    return jsonify(task.to_dict())

#delete
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({'error':'task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message':'Task deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)
                    
 
