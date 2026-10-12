from fastapi import APIRouter
from backend.app.rag.retrieval import load_transcripts_data

router = APIRouter()

@router.get("/")
def get_insights():
    return [
        {
            "id": "ins-1",
            "title": "The Real Definition of Product-Market Fit",
            "category": "Product-Market Fit",
            "episodeTitle": "Product-Market Fit & Traction",
            "episodeNumber": 12,
            "guest": "Peter Reinhardt",
            "timestamp": "14:05",
            "isDemo": False,
            "takeaways": [
                "PMF feels like desperately trying to fulfill demand, not pushing features.",
                "Retention curves must flatten horizontally before scaling spend.",
                "Focus on the 5-10 users who cannot live without you.",
            ],
            "evidenceExcerpt": "When Segment launched, we realized people didn't care about our analytics tool. But when we released analytics.js as an open-source library, GitHub stars exploded and people were begging for enterprise features.",
            "recommendedAction": "Audit your current churned users to isolate the hyper-engaged cohort and rebuild your messaging exclusively around their use case.",
        },
        {
            "id": "ins-2",
            "title": "Building Compounding Growth Loops",
            "category": "Growth Loops",
            "episodeTitle": "Growth Loops & Retention Mechanics",
            "episodeNumber": 84,
            "guest": "Elena Verna & Brian Balfour",
            "timestamp": "08:30",
            "isDemo": False,
            "takeaways": [
                "Linear acquisition funnels suffer from diminishing returns.",
                "Loops reinvest outputs from one user cohort into acquisition of the next.",
                "Product-led virality requires a natural collaborative artifact.",
            ],
            "evidenceExcerpt": "Linear funnels are dead because paid customer acquisition costs always rise over time. Sustainable products win when one cohort of users directly produces the inputs for the next cohort through compounding growth loops.",
            "recommendedAction": "Map out the exact step where an active user exposes your product to a non-user, and eliminate friction at that transfer point.",
        },
        {
            "id": "ins-3",
            "title": "The Sean Ellis 40% PMF Benchmark",
            "category": "Product-Market Fit",
            "episodeTitle": "Finding Your Core User & The PMF Engine",
            "episodeNumber": 103,
            "guest": "Rahul Vohra",
            "timestamp": "19:40",
            "isDemo": False,
            "takeaways": [
                "Ask: How would you feel if you could no longer use the product?",
                "If over 40% answer 'very disappointed', you have product-market fit.",
                "Analyze what the 'somewhat disappointed' group is missing.",
            ],
            "evidenceExcerpt": "At Superhuman, we reverse-engineered product-market fit using the Sean Ellis survey question: 'How would you feel if you could no longer use the product?' If over 40% say very disappointed, you have product-market fit.",
            "recommendedAction": "Run the Sean Ellis survey with your last 50 active users to calculate your current PMF percentage score.",
        },
        {
            "id": "ins-4",
            "title": "The LNO Framework for High-Leverage Work",
            "category": "Leadership",
            "episodeTitle": "Mental Models & Career Frameworks",
            "episodeNumber": 42,
            "guest": "Shreyas Doshi",
            "timestamp": "28:15",
            "isDemo": False,
            "takeaways": [
                "Leverage tasks: 10x impact, deserve 100% excellence.",
                "Neutral tasks: 1x impact, execute well with standard effort.",
                "Overhead tasks: <1x impact, do as quickly and minimally as possible.",
            ],
            "evidenceExcerpt": "The biggest cause of burnout among high achievers is applying Leverage-level perfectionism to Overhead tasks. You have to give yourself permission to do B- work on Overhead.",
            "recommendedAction": "Audit your calendar this week and explicitly tag every meeting and project as L, N, or O.",
        },
    ]
