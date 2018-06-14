import Note from '../models/note';
import Lane from '../models/lane';
import uuid from 'uuid';

export function getNotes(req, res) {
  Note.find().exec((err, notes) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ notes }).status(200).end();
  });
}

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!note || !note.task || !laneId) {
    res.status(400).end();
  }

  const newNote = new Note({
    task: note.task,
  });

  newNote.id = uuid();
  newNote.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    Lane.findOne({ id: laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      });
  });
}

export function deleteNote(req, res) {
  const noteId = req.params.noteId;
  const laneId = req.params.laneId;

  if (!noteId || !laneId) {
    res.status(400).end();
  }

  Note.findOne({ id: noteId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.remove(() => {
      Lane.findOne({ id: laneId }).exec((errLine, lane) => {
        if (errLine) {
          res.status(500).send(errLine);
        }
        const filtredNotes = lane.notes.filter(currentNote => currentNote.id !== noteId);
        lane.notes = filtredNotes;
        lane.save();
        res.json(note).status(200).end();
      });
    });
  });
}

export function editNote(req, res) {
  const { id: noteId, task: newTask } = req.body;

  if (!noteId || !newTask) {
    res.status(400).end();
  }

  Note.findOne({ id: noteId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.task = newTask;
    note.save();
    res.json(note).status(200).end();
  });
}
