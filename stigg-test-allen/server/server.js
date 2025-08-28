import 'dotenv/config'; // add this line at the very top
import express from 'express';
import cors from 'cors';
import { Stigg } from '@stigg/node-server-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const stigg = Stigg.initialize({ apiKey: process.env.VITE_STIGG_SERVER_KEY });
await stigg.waitForInitialization(); // recommended before handling traffic  :contentReference[oaicite:7]{index=7}


// read entitlements
app.get('/api/entitlements/:customerId', async (req, res) => {
    const customerId = req.params.customerId;
    try {
        const boolEnt = await stigg.getBooleanEntitlement({ customerId, featureId: 'feature-export-as-pdf' });
        const numProj = await stigg.getNumericEntitlement({ customerId, featureId: 'feature-projects-created' });
        const numberTasks = await stigg.getMeteredEntitlement({
            customerId, featureId: 'feature-tasks-created', options: {
                requestedUsage: 1
            }
        });
        console.log(numberTasks)
        const metAI = await stigg.getMeteredEntitlement({ customerId, featureId: 'feature-ai-summaries' });
        res.json({
            exportPDF: !!boolEnt?.hasAccess,
            maxProjects: numProj?.value ?? 0,
            taskCount: numberTasks?.currentUsage ?? 9999,
            taskMax: numberTasks?.usageLimit ?? 20,
            hasTaskAccess: numberTasks?.hasAccess ?? false,
            aiSummaries: {
                current: metAI?.currentUsage ?? 0,
                limit: metAI?.usageLimit ?? null,
                periodStart: metAI?.usagePeriodStart ?? null,
                periodEnd: metAI?.usagePeriodEnd ?? null
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: String(e) }); }
});
// event- task creation
app.post('/api/events', async (req, res) => {
    const { customerId, dimensions } = req.body;
    const eventName = "task";
    try {
        await stigg.reportEvent({ customerId, eventName, idempotencyKey: '82f584b6-488f-4275-a0d3-47442d64ad79', dimensions });
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: String(e) }); }
});

// usage for api usage and 
app.post('/api/usage', async (req, res) => {
    const { customerId, value = 1} = req.body;
    const featureId = "feature-ai-summaries"
    try {
        await stigg.reportUsage({ customerId, featureId, value});
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: String(e) }); }
}); // reported usage flow :contentReference[oaicite:11]{index=11}


app.listen(process.env.PORT || 4000, () =>
    console.log('Server listening on ' + (process.env.PORT || 4000))
);
