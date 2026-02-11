import { Router, Request, Response } from 'express';
import { generateHeadline, analyzeCorrelations } from '../services/claude.js';
import { listEntries } from '../services/notion.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/generate-headline', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { comments, attachmentURL, category, tags } = req.body;
    const headline = await generateHeadline({ comments, attachmentURL, category, tags });
    res.json({ headline });
  } catch (error: any) {
    console.error('Headline generation failed:', error);
    res.status(500).json({ error: 'Failed to generate headline' });
  }
});

let correlationCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

router.post('/correlations', async (_req: Request, res: Response) => {
  try {
    if (correlationCache && Date.now() - correlationCache.timestamp < CACHE_TTL) {
      res.json(correlationCache.data);
      return;
    }

    const entries = await listEntries();
    const aiLinks = await analyzeCorrelations(entries);

    // Build manual correlation links from relatedEntries field
    const manualLinks: typeof aiLinks = [];
    for (const entry of entries) {
      if (entry.relatedEntries && entry.relatedEntries.length > 0) {
        for (const relatedId of entry.relatedEntries) {
          // Avoid duplicates (check both directions)
          const exists = manualLinks.some(
            (l) => (l.sourceId === entry.id && l.targetId === relatedId) ||
                   (l.sourceId === relatedId && l.targetId === entry.id)
          );
          if (!exists) {
            manualLinks.push({
              sourceId: entry.id,
              targetId: relatedId,
              label: 'manually linked',
              strength: 1.0,
            });
          }
        }
      }
    }

    // Merge AI + manual links, deduplicating by source-target pair
    const linkKey = (s: string, t: string) => [s, t].sort().join('::');
    const seen = new Set<string>();
    const allLinks = [];
    for (const link of [...manualLinks, ...aiLinks]) {
      const key = linkKey(link.sourceId, link.targetId);
      if (!seen.has(key)) {
        seen.add(key);
        allLinks.push(link);
      }
    }

    // ALL entries become nodes (even if unconnected)
    const nodes = entries.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      tags: e.tags,
    }));

    const graphData = { nodes, links: allLinks };
    correlationCache = { data: graphData, timestamp: Date.now() };

    res.json(graphData);
  } catch (error: any) {
    console.error('Correlation analysis failed:', error);
    res.status(500).json({ error: 'Failed to analyze correlations' });
  }
});

router.post('/correlations/refresh', async (_req: Request, res: Response) => {
  correlationCache = null;
  res.json({ message: 'Cache cleared' });
});

export default router;
