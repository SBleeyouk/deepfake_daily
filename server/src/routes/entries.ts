import { Router, Request, Response } from 'express';
import { listEntries, getEntry, createEntry, updateEntry, getAllTags } from '../services/notion.js';
import { generateHeadline } from '../services/claude.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, tag } = req.query;
    const entries = await listEntries({
      category: category as string | undefined,
      tag: tag as string | undefined,
    });
    res.json(entries);
  } catch (error: any) {
    console.error('Failed to list entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

router.get('/tags', async (_req: Request, res: Response) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (error: any) {
    console.error('Failed to get tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const entry = await getEntry(id);
    res.json(entry);
  } catch (error: any) {
    console.error('Failed to get entry:', error);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, tags, comments, attachmentURL, attachmentFile, thumbnailURL, timeOccurred } = req.body;

    let finalTitle = title;
    if (!finalTitle) {
      try {
        finalTitle = await generateHeadline({ comments, attachmentURL, category, tags });
      } catch {
        finalTitle = 'Untitled Entry';
      }
    }

    const entry = await createEntry({
      title: finalTitle,
      category,
      tags,
      comments,
      attachmentURL,
      attachmentFile,
      thumbnailURL,
      timeOccurred,
      submittedBy: req.userEmail || '',
    });

    res.status(201).json(entry);
  } catch (error: any) {
    console.error('Failed to create entry:', error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const entry = await updateEntry(id, req.body);
    res.json(entry);
  } catch (error: any) {
    console.error('Failed to update entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

export default router;
