import { Router } from 'express';
import * as NoteController from '../controllers/note.controller';

const router = new Router();

// Get all Notes
router.route('/notes').get(NoteController.getNotes);

// Add a new Note
router.route('/notes').post(NoteController.addNote);

// Edit Note
router.route('/notes').put(NoteController.editNote);

// Delete Note by noteId
router.route('/notes/:laneId/:noteId').delete(NoteController.deleteNote);

export default router;
