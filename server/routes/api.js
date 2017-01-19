const express = require('express');
const router = express.Router();

var tasks = [
	{
		name: "Task 1",
		video_url: "task_1_video",
		quiz_url: "task_2_quiz"
	},
	{
		name: "Task 2",
		video_url: "task_2_video",
		quiz_url: "task_2_quiz"
	},
	{
		name: "Task 3",
		video_url: "task_3_video",
		quiz_url: "task_3_quiz"
	}
]

/* GET api listing. */
router.get('/', (req, res) => {
  res.status(200).send('api works');
});

router.get('/tasks', (req, res) => {
  res.status(200).send(tasks);
});

module.exports = router;