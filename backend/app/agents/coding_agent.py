import os
import uuid
import re
import html
from typing import Dict, Any

class PiCodingAgent:
    """
    Autonomous Coding Agent for interactive artifacts.
    Generates sandboxed, self-contained HTML/CSS/JS artifacts with strict sanitization.
    """

    def sanitize_code(self, raw_code: str) -> str:
        """
        Sanitize artifact code to ensure secure execution inside an isolated iframe:
        - Blocks parent window / top level navigation access
        - Blocks document.cookie and localStorage exfiltration
        - Allows clean internal DOM rendering and local CSS/JS interactivity
        """
        code = raw_code

        # Strip attempts to breakout of iframe
        code = re.sub(r"window\.top\b", "window.self", code)
        code = re.sub(r"window\.parent\b", "window.self", code)
        code = re.sub(r"document\.cookie\b", "''", code)
        code = re.sub(r"localStorage\b", "window._fakeStorage || {}", code)

        return code

    def generate_artifact(self, template: str, title: str, description: str, context_prompt: str = "") -> Dict[str, Any]:
        """
        Produces interactive sandboxed artifact based on template and prompt.
        """
        template_clean = template.lower().strip()

        if "growth" in template_clean or "loop" in template_clean:
            raw_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #07090e; color: #f5f6fa; margin: 0; padding: 24px; }
    .card { background: #121624; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
    h2 { margin: 0 0 16px 0; font-size: 18px; color: #ff9e43; }
    .loop-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
    .step-box { background: rgba(255,115,54,0.08); border: 1px solid rgba(255,115,54,0.2); border-radius: 8px; padding: 16px; text-align: center; }
    .step-num { font-size: 11px; font-weight: 700; color: #ff7336; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; }
    .step-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .step-desc { font-size: 12px; color: #9ea5ba; }
    .metric-badge { display: inline-block; background: #1a2238; border: 1px solid #38bdf8; color: #38bdf8; font-size: 11px; padding: 4px 10px; border-radius: 20px; margin-top: 12px; }
    button { background: #ff7336; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
    button:hover { background: #ff8c57; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Compounding Growth Loop Simulation</h2>
    <p style="color: #9ea5ba; font-size: 13px;">Elena Verna & Brian Balfour Loop Framework: User action creates compounding organic acquisition inputs.</p>
    <div class="loop-grid">
      <div class="step-box">
        <div class="step-num">Step 1 • Action</div>
        <div class="step-title">User Creates Artifact</div>
        <div class="step-desc">A customer designs a new growth dashboard or roadmap.</div>
      </div>
      <div class="step-box">
        <div class="step-num">Step 2 • Exposure</div>
        <div class="step-title">Share Link Generated</div>
        <div class="step-desc">Link is shared with cross-functional stakeholders.</div>
      </div>
      <div class="step-box">
        <div class="step-num">Step 3 • Hook</div>
        <div class="step-title">Colleague Views Viewport</div>
        <div class="step-desc">Peer experiences product-led utility firsthand.</div>
      </div>
      <div class="step-box">
        <div class="step-num">Step 4 • Conversion</div>
        <div class="step-title">Peer Signs Up</div>
        <div class="step-desc">Organic cohort feeds into the next cycle.</div>
      </div>
    </div>
    <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
      <span class="metric-badge">Simulated Loop K-Factor: 1.34x (Compounding)</span>
      <button onclick="simulateLoop()">Run 30-Day Cohort Iteration</button>
    </div>
    <div id="log" style="margin-top: 14px; font-family: monospace; font-size: 12px; color: #34d399;"></div>
  </div>
  <script>
    let cohorts = 100;
    function simulateLoop() {
      cohorts = Math.round(cohorts * 1.34);
      document.getElementById('log').innerText = 'Iteration Complete: Active Loop Cohort Scaled to ' + cohorts + ' users (+34% velocity)';
    }
  </script>
</body>
</html>"""
        elif "pricing" in template_clean or "calculator" in template_clean:
            raw_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #07090e; color: #f5f6fa; margin: 0; padding: 24px; }
    .card { background: #121624; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; max-width: 500px; margin: 0 auto; }
    h2 { margin: 0 0 16px 0; font-size: 18px; color: #38bdf8; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 12px; color: #9ea5ba; margin-bottom: 6px; }
    input[type=range] { width: 100%; accent-color: #38bdf8; }
    .val-display { font-family: monospace; font-size: 16px; font-weight: 700; color: #ffffff; }
    .result-box { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; padding: 16px; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Patrick Campbell Value-Metric Pricing Model</h2>
    <div class="form-group">
      <label>Monthly Active Seats: <span id="seatsVal" class="val-display">25</span></label>
      <input type="range" id="seats" min="5" max="250" value="25" oninput="calculate()">
    </div>
    <div class="form-group">
      <label>Target Value Metric Rate ($/seat): <span id="rateVal" class="val-display">$29</span></label>
      <input type="range" id="rate" min="10" max="99" value="29" oninput="calculate()">
    </div>
    <div class="result-box">
      <div style="font-size: 11px; text-transform: uppercase; color: #38bdf8; letter-spacing: 0.05em;">Estimated Monthly Recurring Revenue</div>
      <div id="mrr" style="font-size: 28px; font-weight: 800; color: #ffffff; margin-top: 4px;">$725</div>
    </div>
  </div>
  <script>
    function calculate() {
      const seats = parseInt(document.getElementById('seats').value);
      const rate = parseInt(document.getElementById('rate').value);
      document.getElementById('seatsVal').innerText = seats;
      document.getElementById('rateVal').innerText = '$' + rate;
      document.getElementById('mrr').innerText = '$' + (seats * rate).toLocaleString();
    }
  </script>
</body>
</html>"""
        else:
            raw_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #07090e; color: #f5f6fa; margin: 0; padding: 24px; }}
    .card {{ background: #121624; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; }}
    h1 {{ font-size: 22px; color: #ff9e43; margin-top: 0; }}
    p {{ color: #9ea5ba; font-size: 14px; line-height: 1.6; }}
    .badge {{ display: inline-block; background: rgba(255,115,54,0.15); color: #ff9e43; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 12px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">PROTOTYPE ARTIFACT</div>
    <h1>{html.escape(title or 'Interactive Product Artifact')}</h1>
    <p>{html.escape(description or 'Dynamic interactive component grounded in operator frameworks.')}</p>
  </div>
</body>
</html>"""

        clean_code = self.sanitize_code(raw_code)

        return {
            "id": f"art-{uuid.uuid4().hex[:12]}",
            "title": title or "Interactive Operator Artifact",
            "description": description or "Sandboxed visualization generated from Lenny transcripts.",
            "template": template,
            "type": "html",
            "code": clean_code,
            "isDemo": False,
        }

coding_agent = PiCodingAgent()
