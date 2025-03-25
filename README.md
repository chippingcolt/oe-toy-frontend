This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

You will need the `OPENAI_API_KEY` environment variable.

## Run

Run the development server:

```bash
OPENAI_API_KEY=KEY npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# OpenEvidence Coding Challenge

This is my submission for the ad-targeting challenge provided by OpenEvidence.

---

## ✅ Key Features Added

- **Ad Category Matching**  
  Keyword lookup based on a hard coded data that would replicate a response from a database. Added some logic to provie GPT classification as a fallback.

- **Sponsor Reporting Dashboard**  
  Logs each matched question with category, confidence, timestamp, and whether GPT was used to determine categories.

- **Ad Modal UX**  
  Branded modal shown while GPT generates an answer if the category is sponsored.

- **Rate Limiting**  
  In-memory IP-based throttle to prevent abuse of the endpoint.

---

## ⏱️ Timeboxed Deliverables (~6 hours)

| Feature             | Est. Time | Status  |
| ------------------- | --------- | ------- |
| Category matching   | ~1 hour   | ✅ Done |
| Ad modal component  | ~1 hour   | ✅ Done |
| Reporting dashboard | ~1 hour   | ✅ Done |
| Spinner/modal logic | ~1 hour   | ✅ Done |
| Rate limiting       | ~2 hours  | ✅ Done |

---

## 🚀 Next Steps (Scaling Considerations)

- Add unit + integration tests
- Move ad category & sponsor data into a database
- Improve classification using semantic search or embedding models
- Integrate a robust analytics platform (e.g., PostHog or Segment)
- Track click-throughs, ad impressions, and conversion data for sponsors
- Add an actual more verbose rate limiter that is scalable

---

Thanks for reviewing — I had a great time working on this!
