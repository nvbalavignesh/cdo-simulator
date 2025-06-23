import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Shield, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const CDOSimulator = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [userPath, setUserPath] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const maxQuestions = 10;

  // Question bank with branching logic and difficulty levels
  const questions = {
    // EASY LEVEL QUESTIONS
    easy_start1: {
      id: 'easy_start1',
      category: 'Strategy',
      difficulty: 'easy',
      question: "Your company wants to start using data better. What should you do first?",
      icon: <TrendingUp className="w-6 h-6" />,
      options: [
        { text: "Look at what data we currently have", points: 10, next: ['easy_governance1', 'easy_infrastructure1'] },
        { text: "Hire data analysts right away", points: 6, next: ['easy_talent1', 'easy_culture1'] },
        { text: "Start creating reports and dashboards", points: 8, next: ['easy_projects1', 'easy_stakeholder1'] }
      ]
    },
    
    easy_start2: {
      id: 'easy_start2',
      category: 'Team Building',
      difficulty: 'easy',
      question: "You need to build a data team. What type of person do you hire first?",
      icon: <Users className="w-6 h-6" />,
      options: [
        { text: "Someone who can organize and clean data", points: 10, next: ['easy_governance2', 'easy_infrastructure2'] },
        { text: "Someone who can create charts and analysis", points: 8, next: ['easy_projects2', 'easy_stakeholder2'] },
        { text: "Someone who understands the business", points: 9, next: ['easy_culture2', 'easy_talent2'] }
      ]
    },

    // MEDIUM LEVEL QUESTIONS
    medium_start1: {
      id: 'medium_start1',
      category: 'Strategy',
      difficulty: 'medium',
      question: "Your organization wants to become 'data-driven'. What's your first priority as CDO?",
      icon: <TrendingUp className="w-6 h-6" />,
      options: [
        { text: "Assess current data infrastructure and governance", points: 10, next: ['medium_governance1', 'medium_infrastructure1'] },
        { text: "Hire a team of data scientists immediately", points: 5, next: ['medium_talent1', 'medium_culture1'] },
        { text: "Launch high-visibility analytics projects", points: 7, next: ['medium_projects1', 'medium_stakeholder1'] }
      ]
    },
    
    medium_start2: {
      id: 'medium_start2',
      category: 'Crisis Management',
      difficulty: 'medium',
      question: "A data breach has occurred. As CDO, what's your immediate response?",
      icon: <Shield className="w-6 h-6" />,
      options: [
        { text: "Coordinate with legal and security teams on containment", points: 10, next: ['medium_security1', 'medium_compliance1'] },
        { text: "Focus on public relations and damage control", points: 3, next: ['medium_communication1', 'medium_stakeholder2'] },
        { text: "Conduct thorough investigation before any action", points: 6, next: ['medium_investigation1', 'medium_governance2'] }
      ]
    },

    // HARD LEVEL QUESTIONS
    hard_start1: {
      id: 'hard_start1',
      category: 'Strategic Transformation',
      difficulty: 'hard',
      question: "Your board demands AI-driven competitive advantage while facing regulatory scrutiny and technical debt. What's your strategic approach?",
      icon: <TrendingUp className="w-6 h-6" />,
      options: [
        { text: "Develop a comprehensive data modernization roadmap addressing governance, infrastructure, and AI readiness", points: 10, next: ['hard_governance1', 'hard_infrastructure1'] },
        { text: "Establish AI center of excellence with federated governance model", points: 8, next: ['hard_ai1', 'hard_governance2'] },
        { text: "Implement quick AI wins while building foundational capabilities in parallel", points: 7, next: ['hard_projects1', 'hard_stakeholder1'] }
      ]
    },
    
    hard_start2: {
      id: 'hard_start2',
      category: 'Complex Crisis Management',
      difficulty: 'hard',
      question: "Multiple simultaneous crises: data breach, regulatory audit, and key data platform failure. How do you prioritize and manage?",
      icon: <AlertCircle className="w-6 h-6" />,
      options: [
        { text: "Establish war room with cross-functional teams for each crisis with unified command structure", points: 10, next: ['hard_crisis1', 'hard_governance3'] },
        { text: "Address regulatory compliance first, then breach containment, then platform recovery", points: 8, next: ['hard_compliance1', 'hard_security1'] },
        { text: "Focus on platform recovery to restore business operations while managing other issues", points: 6, next: ['hard_infrastructure2', 'hard_stakeholder2'] }
      ]
    },

    // EASY LEVEL - Continued
    easy_governance1: {
      id: 'easy_governance1',
      category: 'Data Management',
      difficulty: 'easy',
      question: "You found that your data is messy and inconsistent. What do you do?",
      icon: <Database className="w-6 h-6" />,
      options: [
        { text: "Create rules for how data should be formatted", points: 10, next: ['easy_quality1', 'easy_processes1'] },
        { text: "Clean up the data manually", points: 5, next: ['easy_manual1', 'easy_quick1'] },
        { text: "Use software tools to automatically fix data", points: 8, next: ['easy_tools1', 'easy_automation1'] }
      ]
    },

    easy_infrastructure1: {
      id: 'easy_infrastructure1',
      category: 'Technology',
      difficulty: 'easy',
      question: "Your current systems are slow and old. What should you do?",
      icon: <BarChart3 className="w-6 h-6" />,
      options: [
        { text: "Move everything to the cloud", points: 8, next: ['easy_cloud1', 'easy_migration1'] },
        { text: "Upgrade the systems we have now", points: 6, next: ['easy_upgrade1', 'easy_current1'] },
        { text: "Buy new modern systems", points: 7, next: ['easy_new1', 'easy_purchase1'] }
      ]
    },

    // MEDIUM LEVEL - Continued  
    medium_governance1: {
      id: 'medium_governance1',
      category: 'Data Governance',
      difficulty: 'medium',
      question: "You're establishing data governance. What framework do you prioritize?",
      icon: <Database className="w-6 h-6" />,
      options: [
        { text: "Data quality and standardization processes", points: 9, next: ['medium_quality1', 'medium_processes1'] },
        { text: "Data classification and access controls", points: 10, next: ['medium_security2', 'medium_compliance2'] },
        { text: "Data lineage and metadata management", points: 8, next: ['medium_metadata1', 'medium_infrastructure2'] }
      ]
    },

    medium_infrastructure1: {
      id: 'medium_infrastructure1',
      category: 'Technology',
      difficulty: 'medium',
      question: "Your data infrastructure is outdated. What's your modernization approach?",
      icon: <BarChart3 className="w-6 h-6" />,
      options: [
        { text: "Migrate to cloud-based data platform", points: 9, next: ['medium_cloud1', 'medium_migration1'] },
        { text: "Upgrade existing on-premise systems incrementally", points: 6, next: ['medium_upgrade1', 'medium_hybrid1'] },
        { text: "Build entirely new modern data architecture", points: 8, next: ['medium_architecture1', 'medium_greenfield1'] }
      ]
    },

    // HARD LEVEL - Continued
    hard_governance1: {
      id: 'hard_governance1',
      category: 'Enterprise Data Governance',
      difficulty: 'hard',
      question: "You need to implement enterprise-wide data governance across 50+ business units with conflicting requirements. What's your approach?",
      icon: <Database className="w-6 h-6" />,
      options: [
        { text: "Design federated governance model with centralized standards and distributed execution", points: 10, next: ['hard_federated1', 'hard_standards1'] },
        { text: "Implement hub-and-spoke model with centers of excellence", points: 9, next: ['hard_hub1', 'hard_coe1'] },
        { text: "Create governance coalition with rotating leadership and shared accountability", points: 8, next: ['hard_coalition1', 'hard_shared1'] }
      ]
    },

    hard_infrastructure1: {
      id: 'hard_infrastructure1',
      category: 'Enterprise Architecture',
      difficulty: 'hard',
      question: "You must architect a data platform supporting real-time analytics, ML/AI workloads, and strict regulatory compliance across hybrid cloud environments. What's your strategy?",
      icon: <BarChart3 className="w-6 h-6" />,
      options: [
        { text: "Implement data mesh architecture with domain-oriented decentralized data ownership", points: 10, next: ['hard_mesh1', 'hard_domains1'] },
        { text: "Build layered data architecture with streaming, batch, and serving layers", points: 9, next: ['hard_layers1', 'hard_streaming1'] },
        { text: "Deploy multi-cloud data fabric with unified governance and security", points: 8, next: ['hard_fabric1', 'hard_multicloud1'] }
      ]
    },

    // Talent and Culture branch
    talent1: {
      id: 'talent1',
      category: 'People & Culture',
      question: "You're building your data team. What's your hiring priority?",
      icon: <Users className="w-6 h-6" />,
      options: [
        { text: "Data engineers for infrastructure foundation", points: 10, next: ['engineering1', 'infrastructure3'] },
        { text: "Data scientists for immediate analytics value", points: 7, next: ['analytics1', 'projects2'] },
        { text: "Data governance specialists for compliance", points: 8, next: ['governance3', 'compliance3'] }
      ]
    },

    culture1: {
      id: 'culture1',
      category: 'People & Culture',
      question: "Employees resist data-driven decision making. How do you change the culture?",
      icon: <Users className="w-6 h-6" />,
      options: [
        { text: "Start with executive champions and cascade down", points: 10, next: ['leadership1', 'change1'] },
        { text: "Provide comprehensive data literacy training", points: 9, next: ['training1', 'education1'] },
        { text: "Demonstrate quick wins with pilot projects", points: 8, next: ['pilots1', 'projects3'] }
      ]
    },

    // Projects and Stakeholders branch
    projects1: {
      id: 'projects1',
      category: 'Project Management',
      question: "Multiple departments want data projects. How do you prioritize?",
      icon: <TrendingUp className="w-6 h-6" />,
      options: [
        { text: "Focus on projects with highest ROI potential", points: 8, next: ['roi1', 'business1'] },
        { text: "Prioritize projects that improve data foundation", points: 10, next: ['foundation1', 'infrastructure4'] },
        { text: "Balance quick wins with strategic initiatives", points: 9, next: ['balance1', 'strategy1'] }
      ]
    },

    stakeholder1: {
      id: 'stakeholder1',
      category: 'Stakeholder Management',
      question: "The CEO wants AI implementation immediately. How do you respond?",
      icon: <AlertCircle className="w-6 h-6" />,
      options: [
        { text: "Explain the need for data foundation first", points: 10, next: ['foundation2', 'education2'] },
        { text: "Propose a phased AI implementation plan", points: 9, next: ['phased1', 'planning1'] },
        { text: "Start with simple automation and ML use cases", points: 7, next: ['automation1', 'usecase1'] }
      ]
    },

    // Security and Compliance branch
    security1: {
      id: 'security1',
      category: 'Security & Compliance',
      question: "New privacy regulations affect your data practices. What's your approach?",
      icon: <Shield className="w-6 h-6" />,
      options: [
        { text: "Conduct comprehensive data audit and mapping", points: 10, next: ['audit1', 'mapping1'] },
        { text: "Implement privacy-by-design principles", points: 9, next: ['privacy1', 'design1'] },
        { text: "Focus on consent management and user rights", points: 8, next: ['consent1', 'rights1'] }
      ]
    },

    // Final tier questions for each difficulty
    // EASY FINALS
    easy_cloud1: {
      id: 'easy_cloud1',
      category: 'Technology',
      difficulty: 'easy',
      question: "Moving to the cloud is taking longer than expected. What do you do?",
      icon: <Clock className="w-6 h-6" />,
      options: [
        { text: "Move the most important data first", points: 9, next: null },
        { text: "Get help from cloud experts", points: 8, next: null },
        { text: "Slow down and plan better", points: 7, next: null }
      ]
    },

    easy_quality1: {
      id: 'easy_quality1',
      category: 'Data Quality',
      difficulty: 'easy',
      question: "People complain that reports have wrong numbers. How do you fix this?",
      icon: <AlertCircle className="w-6 h-6" />,
      options: [
        { text: "Check where the data comes from and fix it there", points: 10, next: null },
        { text: "Add warnings to reports about data issues", points: 6, next: null },
        { text: "Create a team to check data quality regularly", points: 8, next: null }
      ]
    },

    // MEDIUM FINALS
    medium_cloud1: {
      id: 'medium_cloud1',
      category: 'Technology',
      difficulty: 'medium',
      question: "Your cloud migration is over budget and behind schedule. What do you do?",
      icon: <Clock className="w-6 h-6" />,
      options: [
        { text: "Re-scope to essential components and phase the rest", points: 9, next: null },
        { text: "Negotiate with vendors and optimize current approach", points: 7, next: null },
        { text: "Pause migration and reassess strategy completely", points: 5, next: null }
      ]
    },

    medium_leadership1: {
      id: 'medium_leadership1',
      category: 'Leadership',
      difficulty: 'medium',
      question: "A key executive questions the value of your data initiatives. How do you handle it?",
      icon: <Users className="w-6 h-6" />,
      options: [
        { text: "Present concrete metrics and business impact data", points: 10, next: null },
        { text: "Invite them to collaborate on defining success metrics", points: 9, next: null },
        { text: "Escalate to CEO for organizational alignment", points: 6, next: null }
      ]
    },

    // HARD FINALS
    hard_mesh1: {
      id: 'hard_mesh1',
      category: 'Enterprise Architecture',
      difficulty: 'hard',
      question: "Your data mesh implementation faces resistance from platform teams concerned about operational complexity. How do you proceed?",
      icon: <BarChart3 className="w-6 h-6" />,
      options: [
        { text: "Establish platform abstraction layer with self-service capabilities and operational guardrails", points: 10, next: null },
        { text: "Implement hybrid approach with centralized platform services and domain autonomy", points: 9, next: null },
        { text: "Pilot data mesh with willing domains while building platform team confidence", points: 8, next: null }
      ]
    },

    hard_federated1: {
      id: 'hard_federated1',
      category: 'Governance Strategy',
      difficulty: 'hard',
      question: "Your federated governance model creates inconsistent data definitions across business units, impacting cross-functional analytics. What's your approach?",
      icon: <Database className="w-6 h-6" />,
      options: [
        { text: "Implement semantic layer with canonical data models while preserving local flexibility", points: 10, next: null },
        { text: "Establish data product thinking with clear interfaces and contracts", points: 9, next: null },
        { text: "Create enterprise data council with authority over critical shared definitions", points: 8, next: null }
      ]
    }
  };

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = (selectedDifficulty = null) => {
    if (selectedDifficulty) {
      setDifficulty(selectedDifficulty);
      const startQuestions = Object.keys(questions).filter(key => 
        key.startsWith(`${selectedDifficulty}_start`)
      );
      const randomStart = startQuestions[Math.floor(Math.random() * startQuestions.length)];
      setCurrentQuestion(questions[randomStart]);
      setGameStarted(true);
    }
    setScore(0);
    setQuestionsAnswered(0);
    setGameComplete(false);
    setUserPath([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setDifficulty(null);
    setCurrentQuestion(null);
    setScore(0);
    setQuestionsAnswered(0);
    setGameComplete(false);
    setUserPath([]);
  };

  const handleAnswer = (option) => {
    const newScore = score + option.points;
    const newPath = [...userPath, { question: currentQuestion.question, answer: option.text, points: option.points }];
    
    setScore(newScore);
    setQuestionsAnswered(prev => prev + 1);
    setUserPath(newPath);

    // Check if game should end
    if (questionsAnswered >= maxQuestions - 1 || !option.next) {
      setGameComplete(true);
      return;
    }

    // Select next question randomly from available options
    if (option.next && option.next.length > 0) {
      const availableQuestions = option.next.filter(qId => questions[qId]);
      if (availableQuestions.length > 0) {
        const nextQuestionId = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        setCurrentQuestion(questions[nextQuestionId]);
      } else {
        setGameComplete(true);
      }
    } else {
      setGameComplete(true);
    }
  };

  const getScoreRating = () => {
    if (score >= 85) return { rating: "Exceptional CDO", color: "text-green-600", description: "You demonstrate excellent strategic thinking and leadership" };
    if (score >= 70) return { rating: "Strong CDO", color: "text-blue-600", description: "You show solid data leadership capabilities" };
    if (score >= 55) return { rating: "Developing CDO", color: "text-yellow-600", description: "You have good instincts but room for growth" };
    return { rating: "Emerging CDO", color: "text-orange-600", description: "Focus on building foundational knowledge and experience" };
  };

  const getDifficultyInfo = () => {
    switch(difficulty) {
      case 'easy':
        return { 
          title: 'Beginner CDO', 
          description: 'Perfect for those new to data leadership roles',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'medium':
        return { 
          title: 'Experienced CDO', 
          description: 'For those with some data leadership experience',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'hard':
        return { 
          title: 'Expert CDO', 
          description: 'Advanced scenarios for seasoned data executives',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      default:
        return { title: '', description: '', color: '', bgColor: '' };
    }
  };

  // Difficulty selection screen
  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chief Data Officer Simulator</h1>
          <p className="text-gray-600 mb-6">Test your data leadership skills across different complexity levels</p>
          <p className="text-sm text-gray-500">You'll answer up to {maxQuestions} questions based on your choices</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Easy Level */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
               onClick={() => startNewGame('easy')}>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Easy Level</h3>
              <p className="text-green-700 mb-4">Basic CDO scenarios with straightforward decisions</p>
              <ul className="text-sm text-green-600 text-left space-y-1">
                <li>• Simple data management tasks</li>
                <li>• Basic team building decisions</li>
                <li>• Fundamental technology choices</li>
                <li>• Clear-cut governance scenarios</li>
              </ul>
            </div>
          </div>

          {/* Medium Level */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
               onClick={() => startNewGame('medium')}>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Medium Level</h3>
              <p className="text-blue-700 mb-4">Realistic CDO challenges requiring strategic thinking</p>
              <ul className="text-sm text-blue-600 text-left space-y-1">
                <li>• Complex stakeholder management</li>
                <li>• Infrastructure modernization</li>
                <li>• Data governance frameworks</li>
                <li>• Crisis management scenarios</li>
              </ul>
            </div>
          </div>

          {/* Hard Level */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
               onClick={() => startNewGame('hard')}>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Hard Level</h3>
              <p className="text-purple-700 mb-4">Advanced enterprise scenarios with complex trade-offs</p>
              <ul className="text-sm text-purple-600 text-left space-y-1">
                <li>• Multi-crisis management</li>
                <li>• Enterprise architecture decisions</li>
                <li>• Advanced governance models</li>
                <li>• Strategic transformation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center text-gray-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Each difficulty level contains different scenarios and complexity levels. Choose based on your experience!
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const rating = getScoreRating();
    const difficultyInfo = getDifficultyInfo();
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Simulation Complete!</h1>
          <div className={`inline-block px-4 py-2 rounded-lg ${difficultyInfo.bgColor} mb-4`}>
            <span className={`font-semibold ${difficultyInfo.color}`}>{difficultyInfo.title}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}/100</div>
            <div className={`text-xl font-semibold ${rating.color} mb-2`}>{rating.rating}</div>
            <p className="text-gray-600">{rating.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Decision Path:</h2>
          <div className="space-y-3">
            {userPath.map((step, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4">
                <div className="font-medium text-gray-800 mb-1">Q{index + 1}: {step.question}</div>
                <div className="text-blue-700 mb-1">Your choice: {step.answer}</div>
                <div className="text-sm text-green-600">+{step.points} points</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-x-4">
          <button
            onClick={() => startNewGame(difficulty)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Same Level Again
          </button>
          <button
            onClick={resetGame}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Change Difficulty
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Chief Data Officer Simulator</h1>
        <p className="text-gray-600">Make strategic decisions and see how you'd perform as a CDO</p>
      </div>

      {/* Progress and Score */}
      <div className="flex justify-between items-center mb-8 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">Question {questionsAnswered + 1} of 10</div>
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((questionsAnswered + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="text-lg font-semibold text-blue-600">Score: {score}</div>
      </div>

      {/* Current Question */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-lg p-3 mr-4">
            {currentQuestion.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium text-blue-600">{currentQuestion.category}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyInfo().bgColor} ${getDifficultyInfo().color}`}>
                {getDifficultyInfo().title}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{currentQuestion.question}</h2>
          </div>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-100">
                  <span className="font-semibold text-gray-600 group-hover:text-blue-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span className="text-gray-800 group-hover:text-blue-800">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800 text-sm">
            <strong>Remember:</strong> As a CDO, your decisions impact technology, people, processes, and business outcomes. Consider both immediate needs and long-term strategic goals.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDOSimulator;