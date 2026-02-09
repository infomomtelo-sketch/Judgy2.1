#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Test the JudgyGPT landing page at https://chat-assist-26.preview.emergentagent.com. The landing page should have: 1) Navigation with logo, nav links (How It Works, Pricing, Merch, FAQ), Sign In, Get Roasted Free button, 2) Hero Section with 'The AI That Keeps It Real 💅' headline, JudgyGPT logo, chat preview mockup, 3) How It Works section with 3 steps, 4) Features section, 5) Pricing with 3 plans, 6) Merch Section, 7) Testimonials with 3 review cards, 8) FAQ with expandable questions, 9) Footer with logo, links, emails. Test desktop view (1920x900), mobile view (390x844), navigation clicks, and scroll through all sections."

frontend:
  - task: "Navigation section - Logo, nav links (How It Works, Pricing, Merch, FAQ), Sign In, Get Roasted Free button"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test navigation section with all required elements and functionality"

  - task: "Hero Section - 'The AI That Keeps It Real 💅' headline, JudgyGPT logo, chat preview mockup"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test hero section with headline, logo, and chat preview"

  - task: "How It Works section - 3 steps: Spill the Tea, Get Roasted, Get Helped"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test How It Works section with 3 steps"

  - task: "Features section - Real Talk, Tough Love, Witness Mode (coming soon), Voice Chat (coming soon)"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test Features section with 4 feature cards"

  - task: "Pricing section - 3 plans: Judgement Lite ($0), Talk to Me Nice ($6.99), Bring the Whole Drama ($14.99)"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test Pricing section with 3 pricing tiers"

  - task: "Merch Section - 'Wear the Judgment' with mugs, t-shirts, hats, stickers preview"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test Merch section with 4 product categories"

  - task: "Testimonials section - 3 review cards"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test Testimonials section with 3 review cards"

  - task: "FAQ section - Expandable questions"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test FAQ section with expandable questions"

  - task: "Footer section - Logo, links, emails (hello@judgygptonline.com, support@judgygptonline.com)"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test Footer section with logo, links, and contact emails"

  - task: "Desktop view (1920x900) - verify all sections load properly"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test desktop responsive design at 1920x900"

  - task: "Mobile view (390x844) - verify responsive design"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test mobile responsive design at 390x844"

  - task: "Navigation functionality - 'Get Roasted Free' should go to /register, 'Sign In' should go to /login"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/LandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to test navigation button functionality and routing"

backend:
  - task: "Landing page static content delivery"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "testing"
          comment: "Initial assessment - need to verify backend serves landing page content properly"

metadata:
  created_by: "testing_agent"
  version: "2.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Navigation section - Logo, nav links (How It Works, Pricing, Merch, FAQ), Sign In, Get Roasted Free button"
    - "Hero Section - 'The AI That Keeps It Real 💅' headline, JudgyGPT logo, chat preview mockup"
    - "How It Works section - 3 steps: Spill the Tea, Get Roasted, Get Helped"
    - "Features section - Real Talk, Tough Love, Witness Mode (coming soon), Voice Chat (coming soon)"
    - "Pricing section - 3 plans: Judgement Lite ($0), Talk to Me Nice ($6.99), Bring the Whole Drama ($14.99)"
    - "Merch Section - 'Wear the Judgment' with mugs, t-shirts, hats, stickers preview"
    - "Testimonials section - 3 review cards"
    - "FAQ section - Expandable questions"
    - "Footer section - Logo, links, emails (hello@judgygptonline.com, support@judgygptonline.com)"
    - "Desktop view (1920x900) - verify all sections load properly"
    - "Mobile view (390x844) - verify responsive design"
    - "Navigation functionality - 'Get Roasted Free' should go to /register, 'Sign In' should go to /login"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
    - agent: "testing"
      message: "Starting comprehensive testing of JudgyGPT landing page at https://chat-assist-26.preview.emergentagent.com. Will test all sections: Navigation, Hero, How It Works, Features, Pricing, Merch, Testimonials, FAQ, Footer. Testing desktop (1920x900) and mobile (390x844) views, plus navigation functionality."