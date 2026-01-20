import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      // Not Found (public 404)
      notFound: {
        title: 'Page not found',
        body: "The page you're looking for doesn't exist or was moved. Check the URL or continue browsing.",
        contactUs: 'Contact us',
        needHelp: 'Need help?'
      },

      // Public E-learning
      elearning: {
        lessonNotFound: 'Lesson not found',
        moduleNotFound: 'Module not found',
        breadcrumbRoot: 'E-learning',
        backToModule: '← Back to module',
        lastUpdated: 'Last updated',
        lessonCover: 'Lesson cover',
        quickTip: 'Quick tip',
        prevLesson: 'Prev lesson',
        nextLesson: 'Next lesson',
        shortcutsHint: 'Shortcuts: [ = Prev, ] = Next, Esc = Back to module',
        moduleOutline: 'Module outline',
        relatedLessons: 'Related lessons',
        downloads: 'Downloads',
        relatedModules: 'Related modules',
        start: 'Start',
        startModule: 'Start module →',
        viewModule: 'View module →',
        whatYouWillLearn: "What you'll learn",
        moduleCover: 'Module cover'
      },

      // Public Resources
      resources: {
        title: 'Resources',
        subtitle: 'Reports, audits, policies & templates for full transparency.',
        searchAria: 'Search resources',
        searchPlaceholder: 'Search resources...',
        type: 'Type',
        year: 'Year',
        language: 'Language',
        tags: 'Tags',
        selectTags: 'Select tags',
        clear: 'Clear',
        done: 'Done',
        sort: 'Sort',
        sortNewest: 'Sort: Newest',
        sortOldest: 'Oldest',
        reset: 'Reset',
        noResults: 'No results. Clear filters?',
        clearFilters: 'Clear filters',
        view: 'View',
        download: 'Download',
        rowsLabel: 'Rows:',
        rows: 'Rows per page',
        page: 'Page',
        prev: 'Prev',
        next: 'Next',
        donateBannerTitle: 'Help expand open resources & transparency.',
        devNoticeTitle: 'Notice',
        devNoticeBody: 'It is under development.',
        close: 'Close',
        category: {
          report: 'Report',
          audit: 'Audit',
          policy: 'Policy',
          template: 'Template',
          data: 'Data',
          guide: 'Guide'
        }
      },

      // Public Blog
      blog: {
        listTitle: 'Stories & Insights',
        listSubtitle: 'Field notes, impact updates & research logs.',
        searchPlaceholder: 'Search posts...',
        categories: {
          all: 'All Posts',
          impact: 'Impact Stories',
          insights: 'Insights',
          updates: 'Project Updates',
          research: 'Research',
          howto: 'How-to'
        },
        toolbar: { year: 'Year', tags: 'Tags', selectTags: 'Select tags', clear: 'Clear', done: 'Done', sortNewest: 'Sort: Newest', sortOldest: 'Oldest', reset: 'Reset' },
        none: { empty: 'No posts.', clearFilters: 'Clear filters' },
        read: 'Read →',
        pagination: { rows: 'Rows:', prev: 'Prev', next: 'Next' },
        supportBanner: { title: 'Support field innovation & menstrual dignity education.', cta: 'Donate' },
        articleNotFound: 'Article not found',
        backToList: 'Back to blog',
        onThisPage: 'On this page',
        keepReading: 'Keep Reading',
        popularTopics: 'Popular topics',
        copy: { copy: 'Copy link', copied: 'Copied', share: 'Share' },
        consentVerified: 'Consent verified',
        admin: {
          title: 'Article Management',
          addNew: 'New Article',
          searchPlaceholder: 'Search articles...',
          filters: {
            all: 'All',
            published: 'Published',
            draft: 'Drafts',
            archived: 'Archived'
          },
          table: {
            title: 'Title',
            author: 'Author',
            category: 'Category',
            status: 'Status',  
            date: 'Date',
            actions: 'Actions'
          },
          status: {
            published: 'Published',
            draft: 'Draft',
            archived: 'Archived'
          },
          actions: {
            edit: 'Edit',
            delete: 'Delete',
            publish: 'Publish',
            unpublish: 'Unpublish',
            archive: 'Archive',
            bulkDelete: 'Delete Selected',
            confirmDelete: 'Are you sure you want to delete the selected articles?',
            confirmDeleteSingle: 'Are you sure you want to delete this article?'
          },
          messages: {
            noArticles: 'No articles found',
            articlesSelected: 'articles selected',
            loadingError: 'Error loading articles',
            deleteSuccess: 'Article(s) deleted successfully',
            deleteError: 'Error deleting articles'
          }
        }
      },

      // Public Projects
      projectsPage: {
        headerSubtitle: 'Discover and support our ongoing projects that make a real difference.',
        filters: { allTypes: 'All Types', distribution: 'Distribution', training: 'Training', research: 'Research', allStatus: 'All Status', active: 'Active', draft: 'Draft', completed: 'Completed', reset: 'Reset' },
        showing: 'Showing',
        of: 'of',
        filteredProjects: 'filtered projects',
        total: 'total',
        none: { empty: 'No projects.', reset: 'Reset filters' },
        pagination: { rows: 'Rows:', prev: 'Prev', next: 'Next' }
      },

      // Public Contact
      contact: {
        title: 'Get in touch with the team',
        subtitle: 'Questions about projects, partnerships, volunteering, donations, or media? Reach out—we respond to every message.',
        form: {
          name: 'Name *',
          email: 'Email *',
          inquiryType: 'Inquiry Type',
          subject: 'Subject *',
          message: 'Message *',
          placeholders: { name: 'Your full name', email: 'you@example.com', subject: 'Brief subject', message: 'Your message...' },
          types: { general: 'General Inquiry', partnership: 'Partnership', volunteer: 'Volunteering', donation: 'Donation', media: 'Media' },
          send: 'Send Message',
          sent: 'Message sent!'
        },
        details: {
          title: 'Contact details', personRole: 'Contact person & role', email: 'Email', phone: 'Phone', address: 'Address',
          addressLines: {
            line1: 'HQ in Dunkirk, Maryland, USA',
            line2: 'Province/State: Maryland (USA)',
            line3: 'Territory/District: HQ: Dunkirk'
          },
          officeHours: 'Office Hours',
          weekday: 'Mon–Fri', saturday: 'Saturday', sunday: 'Sunday', closed: 'Closed'
        },
        social: { title: 'Follow & share', facebook: 'Facebook', twitter: 'Twitter / X', whatsapp: 'WhatsApp', instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn' },
        cta: { title: 'Partner with us to advance menstrual dignity and education.', donate: 'Donate' }
      },

      // E-learning index
      elearningIndex: {
        title: 'E-learning',
        subtitle: 'Free, practical lessons on menstrual health—reusable kits, safe use, and dignity. No login required.',
        search: 'Search lessons...',
        topic: 'Topic',
        level: 'Level',
        length: 'Length',
        sort: { newest: 'Sort: Newest', oldest: 'Oldest', shortest: 'Shortest', longest: 'Longest' },
        reset: 'Reset',
        noResults: 'No results. Clear filters.',
        retry: 'Retry',
        startReading: 'Start reading →',
        newsletter: { title: 'Stay in the loop — new lessons monthly.', emailPlaceholder: 'Your email address', subscribe: 'Subscribe' },
        donateBanner: { title: 'Support free, open e-learning content.', donate: 'Donate' },
        pagination: { rows: 'Rows:', page: 'Page', prev: 'Prev', next: 'Next' }
      },

      // Transparency extras
      transparencyExtras: {
        filterByType: 'Filter by Type',
        filterByStatus: 'Filter by Status',
        questions: 'Questions about our transparency?',
        promise: "We're committed to full transparency. Contact us for detailed financial reports or project updates.",
        contactUs: 'Contact Us',
        downloadAnnual: 'Download Annual Report'
      },

      // Public Donation
      donation: {
        title: 'Keep girls learning every month',
        subtitle: 'Your gift funds menstrual kits, school sessions and basic WASH improvements so no girl misses class because of her period.',
        impactTiers: {
          kit: '1 menstrual hygiene kit for 6 months',
          training: 'Full training for a class of 30 students',
          facilities: 'Equip a school with adapted facilities'
        },
        yourDonation: 'Your Donation',
        donationType: 'Donation Type',
        oneTime: 'One-time',
        monthly: 'Monthly',
        mostImpact: 'Most Impact',
        amountLabel: 'Amount (USD) – supports kits & education',
        enterCustomAmount: 'Enter custom amount',
        focusArea: 'Focus Area',
        donationSummary: '{{type}} donation:',
        focusPrefix: 'Focus:',
        donorInformation: 'Donor Information',
        fields: {
          firstName: 'First Name *',
          lastName: 'Last Name *',
          email: 'Email *',
          phoneOptional: 'Phone (Optional)',
          addressOptional: 'Address (Optional)',
          city: 'City',
          country: 'Country',
          anonPlaceholder: 'Anonymous',
          anonDash: '—',
          emailOptionalNoReceipt: 'Optional (no receipt will be emailed)',
          emailForReceipt: 'For donation receipt'
        },
        anonymousLabel: 'Make this donation anonymous',
        anonymousHint: "We won’t store your name or email. If you enter an email, we’ll only use it to send a receipt.",
        taxTitle: 'Tax Deductible:',
        taxBody: 'Your donation is tax-deductible to the full extent allowed by law. You will receive a receipt via email for your records.',
        payButton: 'Donate ${{amount}} with Stripe',
        preparingCheckout: 'Preparing secure checkout...',
        secureProcessing: 'Secure payment processing by Stripe',
        infoSafe: 'Your information is safe and encrypted',
        otherWaysTitle: 'Other Ways to Support Dignity',
        volunteerTitle: 'Volunteer',
        volunteerDesc: 'Assist during distribution days or education sessions.',
        spreadTitle: 'Spread the Word',
        spreadDesc: 'Normalize menstrual health conversations in your network.',
        corporateTitle: 'Corporate Partnership',
        corporateDesc: 'Sponsor kits or fund a school WASH improvement cluster.',
        contactUs: 'Contact Us',
        transparencyTitle: 'Transparency Promise',
        transparencyDesc: 'We believe in transparency. Track how your donation is used through detailed reports and impact tracking.',
        viewReports: 'View Reports',
        devNoticeTitle: 'Notice',
        devNoticeBody: 'It is under development.',
        close: 'Close'
      },
      // Navigation
      nav: {
        projects: 'Projects',
        about: 'About',
        resources: 'Resources',
        blog: 'Blog',
        contact: 'Contact',
        donate: 'Donate',
        signin: 'Sign In',
        signup: 'Sign Up',
        menuToggle: 'Toggle menu',
        menu: 'Menu',
        close: 'Close menu'
      },
      nav_mh: {
        projects: 'Menstrual Health Projects',
        resources: 'Menstrual Health Resources',
        blog: 'Stories & Insights',
        elearning: 'E-learning (Menstrual Health)',
        about: 'About Our Menstrual Health Mission'
      },
      
      // Landing Page
      landing: {
  title: 'Transform menstrual health education in Africa',
  subtitle: 'We break taboos, educate communities, and provide sustainable solutions so every girl can manage her period with dignity.',
  valueProp: 'Because no girl should miss school because of her period',
        description: 'Join us in creating sustainable change through innovative projects that provide education, resources, and opportunities to communities worldwide.',
        exploreProjects: 'Explore Projects',
        makeDonation: 'Make a Donation',
        featuredProjects: 'Featured Projects',
        featuredDescription: 'Discover the projects making a real difference in communities worldwide',
  // New human-like single line section titles
  whyTitle: "Education with dignity transforms a girl's future",
  storiesTitle: 'Discover real voices and moments from the field',
  featuredProjectsTitle: 'Choose a project you believe in and follow its progress',
  featuredProjectsTitle_mh: 'Back a menstrual health project and follow real impact',
  momentsTitle: 'Locally sewn kits, women leading, girls keeping their days',
  imagesDisclaimer: 'Images shown are illustrative placeholders for the prototype',
  howTitle: 'See how your support turns into measurable impact',
  partnersTitle: 'We work hand‑in‑hand with committed local partners',
  countriesTitle: 'Where we are learning, building, and expanding together',
  ourImpact: 'Why Educate4Dignity',
        impactDescription: 'Together, we\'re creating lasting change',
        projectsCompleted: 'Projects Completed',
        livesImpacted: 'Lives Impacted',
        countriesReached: 'Countries Reached',
        fundsRaised: 'Funds Raised'
      },

      // Workflow Diagram (used in LandingPage)
      workflow: {
        define: {
          title: 'Define',
          desc: 'Set goals & plan'
        },
        donate: {
          title: 'Donate',
          desc: 'Funds allocated'
        },
        produce: {
          title: 'Produce',
          desc: 'Local women craft kits'
        },
        distribute: {
          title: 'Distribute',
          desc: 'Kits delivered & logged'
        },
        educate: {
          title: 'Educate',
          desc: 'Hygiene learning sessions'
        }
      },

      // UI Common
      ui: {
        mode: {
          light: 'Light',
          dark: 'Dark',
          toggle: 'Toggle dark mode',
          switchToLight: 'Switch to light mode',
          switchToDark: 'Switch to dark mode'
        }
      },

      audience: {
        labels: {
          beneficiaries: 'Beneficiaries',
          donors: 'Donors',
          partners: 'Partners'
        },
        beneficiaries: {
          sectionTitle: "Your path to confidence",
          p1: 'Understand your body without shame',
          p2: 'Learn with female facilitators who get you',
          p3: 'Receive free, durable menstrual hygiene kits',
          p4: 'Join a supportive sisterhood community'
        },
        donors: {
          sectionTitle: 'Your concrete impact',
          i1: '$15 = 1 menstrual hygiene kit for 6 months',
          i2: '$50 = Full training for a class of 30 students',
          i3: '$100 = Equip a school with adapted facilities',
          transparency: 'Track every dollar all the way to the beneficiaries'
        },
        partners: {
          sectionTitle: 'Let\'s build together',
          i1: 'Schools: Embed menstrual health education & supportive facilities',
          i2: 'NGOs & local associations: Run kit production and distribution points',
          i3: 'Community & faith leaders: Break stigma and champion girls\' dignity'
        },
        overview: {
          title: 'Paths, impact and collaboration'
        },
        pedagogy: {
          sectionTitle: 'Our learning approach',
          i1: 'Participatory method adapted to cultural realities',
          i2: 'Training in local languages with visual supports',
            i3: 'Mixed parent–girl sessions to lift family taboos'
        },
        menstrualHealth: {
          sectionTitle: 'Clear, practical menstrual health',
          i1: 'Hygiene: preventing infections',
          i2: 'Pain management with natural methods',
          i3: 'When to seek care: warning signs explained simply'
        }
      },
      projectCard: {
        supportCta: 'Advance menstrual health',
        supportCtaLong: 'Advance menstrual health & dignity',
        locationFrom: 'Location',
        funded: 'funded'
      },
      
      // Authentication
      auth: {
        login: 'Login',
        email: 'Email',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signin: 'Sign In',
        noAccount: 'Don\'t have an account?',
        signup: 'Sign up',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password'
      },
      
      // Admin Dashboard
      admin: {
        dashboard: 'Dashboard',
        projectsNav: 'Projects',
        suppliers: 'Suppliers',
        distributors: 'Distributors',
        beneficiaries: 'Beneficiaries',
  finances: 'Finances',
        totalDonations: 'Total Donations',
        thisMonth: 'This Month',
        avgDonation: 'Avg Donation',
        monthlyTrend: 'Monthly Donations Trend',
        recentActivity: 'Recent Donor Activity',
        monthlyDonation: 'Monthly Donation',
        oneTimeDonation: 'One-time Donation',
        description: 'Financial overview and transactions',
  donors: 'Donors',
        elearning: 'E-learning',
    blog: 'Blog',
    gallery: 'Gallery',
        resources: 'Resources',
        research: 'R&D',
  team: 'Team',
  admin: 'Admin',
        settings: 'Settings',
        welcome: 'Welcome back! Here\'s what\'s happening with your projects.',
        totalProjects: 'Total Projects',
        activeProjects: 'Active Projects',
        totalRaised: 'Total Raised',
        fundingProgress: 'Funding Progress',
        recentProjects: 'Recent Projects',
        recentDonations: 'Recent Donations',
  noMessage: 'No message',
        // Jessica Dashboard
        jessicaWelcome: 'Building dignity through education — here\'s your impact overview.',
        impact: {
          girlsTrained: 'Girls Trained',
          kitsDistributed: 'Kits Distributed',
          schoolAttendance: 'School Attendance Rate',
          communityReach: 'Community Reach (miles)',
          monthlyProgress: 'Monthly Progress',
          impactGrowth: 'Impact Growth',
          communityFeedback: 'Community Feedback',
          projectMilestones: 'Project Milestones'
        },
        projects: {
          jessicaActive: 'Active Jessica Projects',
          completed: 'Completed',
          inProgress: 'In Progress',
          planning: 'Planning'
        },
        recentActivities: {
          title: 'Recent Activities',
          training: 'Training Session',
          distribution: 'Kit Distribution',
          meeting: 'Community Meeting',
          report: 'Impact Report',
          noActivities: 'No recent activities'
        },
  ui: {
          groups: {
            operations: 'Operations & Projects',
            finance: 'Finance & Donors',
            content: 'Content & Learning',
            governance: 'Governance & Administration'
          },
          distributors: {
            listTitle: 'Distributors list',
            total: 'Total distributors',
            contact: 'Main contact',
            volume: 'Distributed volume (kits)',
            satisfaction: 'Average satisfaction',
            profile: {
              title: 'Distributor profile',
              notFound: 'Distributor not found.',
              users: 'Users',
              addUser: 'Add user',
              role: 'Role',
              lastAccess: 'Last access',
              deactivate: 'Deactivate',
              activate: 'Activate',
              noUsers: 'No users',
              associatedProjects: 'Associated projects',
              noProjects: 'No associated projects',
              notes: 'Notes',
              agreement: 'Agreement',
              lastReport: 'Last report',
              download: 'Download'
            },
            create: {
              title: 'New distributor',
              placeholders: { name: 'Ex: Ecole Kanyosha' },
              contract: 'Contract (optional)',
              selected: 'Selected'
            }
          },
          quick: {
            dashboard: 'Dashboard'
          },
          table: {
            recentItems: 'Recent Items',
            date: 'Date',
            type: 'Type',
            reference: 'Reference',
            status: 'Status',
            amount: 'Amount',
            actions: 'Actions',
            searchPlaceholder: 'Search...'
          },
          filters: {
            all: 'All',
            period30: '30d',
            period90: '90d',
            period365: '365d'
          },
          status: {
            success: 'success',
            pending: 'in progress',
            submitted: 'submitted',
            validated: 'validated',
            refunded: 'refunded',
            rejected: 'rejected',
            draft: 'draft',
            active: 'active'
          },
          types: {
            project: 'project',
            donation: 'donation',
            report: 'report'
          },
          actions: {
            view: 'view',
            edit: 'edit',
            validate: 'validate',
            help: 'Help',
            logout: 'Logout',
            exportCsv: 'Export CSV',
            publish: 'Publish',
            unpublish: 'Unpublish',
            publishSelected: 'Publish selected',
            bulk: 'Bulk actions'
          },
          resources: {
            kpis: {
              total: 'Total documents',
              pending: 'Pending validation',
              published: 'Published (public)',
              retired: 'Retired/archived'
            },
            filters: {
              type: 'Type',
              year: 'Year',
              visibility: 'Visibility'
            },
            language: 'Language',
            size: 'Size',
            visibility: { label: 'Visibility', public: 'Public', internal: 'Internal' },
            status: { retired: 'Retired' },
            actions: { retire: 'Retire', confirmDelete: 'Delete this item?' },
            modal: {
              title: 'Upload a document (simple)',
              hint: 'Drop a file (optional). Metadata is enough for the demo.',
              dropHere: 'Drag & drop a file here',
              chooseFile: 'Choose a file',
              file: 'File',
              change: 'Change',
              desc: 'Short description',
              descPlaceholder: 'Displayed on public page',
              placeholders: { title: 'Document title' }
            }
          },
          donors: {
            anon: 'Anon.',
            kpis: { collected: 'Collected', average: 'Average donation', last: 'Last donation' },
            table: { count: 'Donations' },
            filters: { dest: { general: 'General fund' } },
            profile: {
              title: 'Donor profile',
              notFound: 'Donor not found.',
              history: 'Donations history',
              destination: 'Destination',
              method: 'Method',
              amount: 'Amount',
              requestRefund: 'Request refund',
              noDonations: 'No donations',
              projects: 'Projects supported',
              generalOnly: 'General fund only',
              refunds: 'Refunds',
              noRefunds: 'No refund requests.',
              donation: 'Donation',
              selectDonation: 'Select donation',
              reason: 'Reason',
              since: 'Since'
            }
          },
          charts: {
            collectePlanDep: 'Collected vs Planned vs Spent (monthly)',
            milestones: 'Milestones completed (%)',
            spendingSplit: 'Spending breakdown'
          },
          kpis: {
            activeProjects: 'ACTIVE PROJECTS',
            collected: 'COLLECTED',
            spent: 'SPENT',
            beneficiaries: 'BENEFICIARIES'
          },
          projectsAdmin: {
            total: 'Total projects',
            plannedBudget: 'Planned budget',
            collected: 'Collected',
            spent: 'Spent',
            execution: 'Execution',
            table: {
              id: 'ID', name: 'Name', type: 'Type', organisation: 'Organisation', location: 'Location', dates: 'Dates', status: 'Status', budget: 'Budget', collected: 'Collected', spent: 'Spent'
            },
            filters: {
              type: 'Type', status: 'Status', country: 'Country', org: 'Org', period: 'Period'
            },
            create: {
              title: 'Create New Project',
              name: 'Project name',
              placeholderName: 'Ex: Gitega School Dignity Kits',
              manager: 'Project manager',
              operators: 'Field operators',
              type: 'Type',
              org: 'Organisation (type + entity)',
              organisationType: 'Type',
              organisationEntity: 'Entity',
              dates: 'Dates',
              startDate: 'Start date',
              endDate: 'End date',
              location: 'Location',
              country: 'Country',
              state: 'Province/State',
              city: 'City',
              template: 'Template (if distribution/training)',
              description: 'Description',
              plannedBudget: 'Planned total budget (USD)',
              code: 'Project code (auto)',
              createdBy: 'Created by',
              createdAt: 'Created at',
              tipRequired: 'Tip: Fields marked * are required. Errors show below fields.',
              saveDraft: 'Save draft',
              create: 'Create',
              createContinue: 'Create & continue',
              cancel: 'Cancel',
              operatorsPlaceholder: 'Add/remove operators',
              required: 'This field is required',
              budgetInvalid: 'Invalid budget value',
              shortDescription: 'Short description',
              coverImage: 'Cover image',
              videoUrl: 'Video URL',
              initialCollected: 'Initial collected (USD)',
              coverRequired: 'Cover image is required'
              ,videoSource: 'Video source'
              ,videoFile: 'Video file'
              ,sourceUrl: 'Link'
              ,sourceUpload: 'Upload'
              ,removeVideo: 'Remove video'
              ,type_blank: 'Blank'
              ,type_distribution: 'Distribution'
              ,type_formation: 'Training'
              ,type_recherche_dev: 'Research & Development'
              ,type_achat: 'Purchase'
              ,type_hybride: 'Hybrid (Distribution + Training)'
              ,operatorsLabel: 'Field operators'
              ,primaryOperator: 'Primary operator'
              ,operatorsRequired: 'Select at least one operator'
              ,primaryOperatorRequired: 'Select a primary operator'
              ,operatorSearch: 'Search operator...'
              ,orgType_ong: 'NGO'
              ,orgType_ecole: 'School'
              ,orgType_association: 'Association'
              ,orgType_institution: 'Institution'
              ,orgType_organisation: 'Organisation'
              ,detail_tabs_resume: 'Summary'
              ,detail_tabs_plan: 'Plan'
              ,detail_tabs_production: 'Production'
              ,detail_tabs_distribution: 'Distribution'
              ,detail_tabs_formation: 'Training'
              ,detail_tabs_transparency: 'Transparency'
              ,detail_tabs_depenses: 'Spending'
              ,detail_tabs_rapports: 'Reports'
              ,detail_tabs_beneficiaires: 'Beneficiaries'
              ,detail_checklist_title: 'Checklist — Next steps'
              ,detail_project_info: 'Project info'
              ,detail_quick_actions: 'Quick actions'
              ,action_open_production: 'Open Production'
              ,action_open_distribution: 'Open Distribution'
              ,action_add_expense: 'Add expense'
              ,action_upload_report: 'Upload report'
              ,action_import_beneficiaries: 'Import beneficiaries'
              ,action_export_pdf: 'Export PDF'
            }
            , newProject: 'New project'
          },
          blog: {
            kpis: {
              total: 'Total articles',
              drafts: 'Drafts',
              published: 'Published',
              views30: 'Views (30d)'
            },
            filters: {
              all: 'All',
              published: 'Published',
              draft: 'Drafts',
              archived: 'Archived'
            },
            actions: {
              bulkDelete: 'Delete selected',
              confirmDelete: 'Delete selected articles?'
            }
          },
          months: {
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec'
          }
        }
      },
      
      // Common
      common: {
        search: 'Search...',
        notifications: 'Notifications',
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        create: 'Create',
        update: 'Update',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        learnMore: 'Learn More',
        viewAll: 'View All',
        progress: 'Progress',
        close: 'Close',
        open: 'Open',
        select: 'Select',
        filter: 'Filter',
        sort: 'Sort',
        export: 'Export',
        import: 'Import',
        upload: 'Upload',
        download: 'Download',
        // Admin table/common fields
        title: 'Title',
        category: 'Category',
        tags: 'Tags',
        author: 'Author',
        updated: 'Updated',
        level: 'Level',
        duration: 'Duration',
        rows: 'Rows',
        noResults: 'No results',
        done: 'Done',
        reset: 'Reset'
      },
      
      // Transparency
      transparency: {
        title: 'Transparency & Accountability',
        subtitle: 'Track the progress and impact of every project. We believe in complete transparency.',
        kpis: {
          planned: 'Planned Budget',
          collected: 'Collected',
          spent: 'Spent',
          gap: 'Funding Gap',
          beneficiaries: 'Beneficiaries'
        },
        chart: {
          monthlyOverview: 'Monthly Financial Overview',
          legend: {
            planned: 'Planned',
            collected: 'Collected',
            spent: 'Spent'
          },
          month: 'Month'
        },
        expenses: {
          title: 'Expenses',
          category: 'Category',
          amount: 'Amount',
          date: 'Date',
          filterCategory: 'Filter Category',
          filterMonth: 'Filter Month',
          noData: 'No expenses found'
        },
        milestones: 'Project Milestones',
        documents: 'Available Documents',
        financialBreakdown: 'Financial Breakdown',
        budgetUtilization: 'Budget Utilization',
        remaining: 'Remaining',
        projectProgress: 'Project Progress',
        viewDetails: 'View Details',
        hideDetails: 'Hide Details'
      },
      // Newsletter
      newsletter: {
        title: 'Newsletter',
        description: 'Sign up for monthly updates.',
        placeholder: 'you@example.com',
        cta: 'Subscribe',
        success: 'Thank you! Check your email.',
        invalid: 'Invalid address',
        failure: 'Failed, please retry',
        privacy: 'Data protection: unsubscribe with one click in every email.'
      }
      ,education: {
        title: 'Why menstrual health education matters',
  lead: 'Knowledge and dignity keep girls in school.',
    p1: 'When a girl does not know how to manage her period safely, she stays home. In many African schools, water is scarce and privacy is thin, so confusion turns into fear, and fear becomes missed days. Kits are the start. Training makes them work',
  p2: '',
  cta: 'See more content about menstruation health'
      }
      ,aboutPage: {
        hero: {
          title: 'About Educate4Dignity',
          subtitle: 'We break taboos, educate communities, and provide sustainable, reusable solutions so every girl can manage her period with dignity.'
        },
        video: {
          aria: 'Organization overview video',
          unsupported: 'Your browser does not support the video tag.',
          caption: 'Clip from a school distribution session, capturing the energy in the room when girls receive their kits and guidance.'
        },
        mission: {
          title: 'Our mission',
          body: 'Across Burundi and the wider East Africa region, too many learners miss lessons during menstruation, not for lack of motivation, but because of cost, silence, inadequate WASH facilities and limited guidance.',
          bullets: {
            education: 'Education: clear, stigma-free menstrual health learning.',
            access: 'Access: sustainable, reusable kits & locally sourced materials.',
            facilities: 'Facilities (WASH): privacy, water & handwashing that match real school contexts.',
            capacity: 'Local capacity: co-building with cooperatives, teachers & health workers.'
          }
        },
        vision: {
          title: 'Our vision',
          body: "A region where no learner's education is interrupted by menstruation, where dignity, health, and opportunity are standard in every classroom.",
          bullets: {
            schools: 'Every school equipped with practical menstrual health education and WASH facilities.',
            production: 'Local women-led production sustaining affordable, reusable solutions.',
            transparency: 'Transparent impact data shared to accelerate what works.'
          }
        },
        approach: {
          whyTitle: 'Why it matters',
          whyBody: 'Education delays early marriage, improves health and multiplies community resilience. A pad is not the whole answer, but without one, too many futures shrink.',
          howTitle: 'How we work',
          howBody: 'We listen first, co-design with schools and cooperatives, document early, publish openly and iterate to create replicable support.',
          valueTitle: 'What we value',
          valueBody: 'Dignity, transparency and local intelligence. We remove basic health barriers so education remains uninterrupted.'
        },
        founder: {
          title: 'Founder\'s note',
          p1: 'I began listening to girls in Bujumbura in 2023. The pattern was simple and painful: curiosity and ambition blocked by a pad that was never there. A basic supply determining academic confidence felt unacceptable.',
          p2: 'Our approach now is to prototype small, evidence-light solutions, share data, and widen partnerships, always centering the student experience. Biology should not decide who sits in a classroom.',
          quote: 'Dignity is not a luxury add-on. It is the quiet infrastructure of learning.'
        },
        team: {
          title: 'Team',
          roles: {
            opsTitle: 'Operations Lead',
            opsBody: 'Program logistics & cooperative coordination.',
            opsAlt: 'Operations lead overseeing distribution workflows',
            finTitle: 'Finance & Compliance',
            finBody: 'Budget discipline, transparent reporting.',
            finAlt: 'Finance and compliance specialist',
            eduTitle: 'Education & Research',
            eduBody: 'MHM content, training design, monitoring.',
            eduAlt: 'Education & research facilitator'
          },
          disclaimer: 'Images are placeholders; replace with consented photos for production.'
        },
        cta: {
          title: 'Join us in restoring dignity',
          donate: 'Donate'
        }
      }
      
    }
  },
  fr: {
    translation: {
      // Not Found (public 404)
      notFound: {
        title: 'Page introuvable',
        body: 'La page que vous recherchez n’existe pas ou a été déplacée. Vérifiez l’URL ou poursuivez votre navigation.',
        contactUs: 'Nous contacter',
        needHelp: 'Besoin d’aide ?'
      },

      // Public E-learning
      elearning: {
        lessonNotFound: 'Leçon introuvable',
        moduleNotFound: 'Module introuvable',
        breadcrumbRoot: 'E-learning',
        backToModule: '← Retour au module',
        lastUpdated: 'Dernière mise à jour',
        lessonCover: 'Couverture de la leçon',
        quickTip: 'Astuce',
        prevLesson: 'Leçon précédente',
        nextLesson: 'Leçon suivante',
        shortcutsHint: 'Raccourcis : [ = Préc, ] = Suiv, Échap = Retour au module',
        moduleOutline: 'Plan du module',
        relatedLessons: 'Leçons liées',
        downloads: 'Téléchargements',
        relatedModules: 'Modules liés',
        start: 'Démarrer',
        startModule: 'Démarrer le module →',
        viewModule: 'Voir le module →',
        whatYouWillLearn: 'Ce que vous allez apprendre',
        moduleCover: 'Couverture du module'
      },

      // Public Resources
      resources: {
        title: 'Ressources',
        subtitle: 'Rapports, audits, politiques et modèles pour une transparence totale.',
        searchAria: 'Rechercher des ressources',
        searchPlaceholder: 'Rechercher des ressources...',
        type: 'Type',
        year: 'Année',
        language: 'Langue',
        tags: 'Tags',
        selectTags: 'Sélectionner des tags',
        clear: 'Effacer',
        done: 'Terminé',
        sort: 'Trier',
        sortNewest: 'Trier : plus récent',
        sortOldest: 'Plus ancien',
        reset: 'Réinitialiser',
        noResults: 'Aucun résultat. Effacer les filtres ?',
        clearFilters: 'Effacer les filtres',
        view: 'Voir',
        download: 'Télécharger',
        rowsLabel: 'Lignes :',
        rows: 'Lignes par page',
        page: 'Page',
        prev: 'Préc',
        next: 'Suiv',
        donateBannerTitle: 'Aidez à élargir les ressources ouvertes et la transparence.',
        devNoticeTitle: 'Avis',
        devNoticeBody: 'C’est en cours de développement.',
        close: 'Fermer',
        category: {
          report: 'Rapport',
          audit: 'Audit',
          policy: 'Politique',
          template: 'Modèle',
          data: 'Données',
          guide: 'Guide'
        }
      },

      // Public Blog
      blog: {
        listTitle: 'Histoires & Perspectives',
        listSubtitle: 'Notes du terrain, mises à jour d’impact et carnets de recherche.',
        searchPlaceholder: 'Rechercher des articles...',
        categories: {
          all: 'Tous les articles',
          impact: 'Histoires d’impact',
          insights: 'Perspectives',
          updates: 'Mises à jour',
          research: 'Recherche',
          howto: 'Guide'
        },
        toolbar: { year: 'Année', tags: 'Tags', selectTags: 'Sélectionner des tags', clear: 'Effacer', done: 'Terminé', sortNewest: 'Trier : plus récent', sortOldest: 'Plus ancien', reset: 'Réinitialiser' },
        none: { empty: 'Aucun article.', clearFilters: 'Effacer les filtres' },
        read: 'Lire →',
        pagination: { rows: 'Lignes :', prev: 'Préc', next: 'Suiv' },
        supportBanner: { title: 'Soutenir l’innovation terrain & l’éducation à la dignité menstruelle.', cta: 'Faire un don' },
        articleNotFound: 'Article introuvable',
        backToList: 'Retour au blog',
        onThisPage: 'Sur cette page',
        keepReading: 'Continuer la lecture',
        popularTopics: 'Sujets populaires',
        copy: { copy: 'Copier le lien', copied: 'Copié', share: 'Partager' },
        consentVerified: 'Consentement vérifié',
        admin: {
          title: 'Gestion des Articles',
          addNew: 'Nouvel Article',
          searchPlaceholder: 'Rechercher des articles...',
          filters: {
            all: 'Tous',
            published: 'Publiés',
            draft: 'Brouillons',
            archived: 'Archivés'
          },
          table: {
            title: 'Titre',
            author: 'Auteur',
            category: 'Catégorie',
            status: 'Statut',  
            date: 'Date',
            actions: 'Actions'
          },
          status: {
            published: 'Publié',
            draft: 'Brouillon',
            archived: 'Archivé'
          },
          actions: {
            edit: 'Modifier',
            delete: 'Supprimer',
            publish: 'Publier',
            unpublish: 'Dépublier',
            archive: 'Archiver',
            bulkDelete: 'Supprimer sélectionnés',
            confirmDelete: 'Êtes-vous sûr de vouloir supprimer les articles sélectionnés ?',
            confirmDeleteSingle: 'Êtes-vous sûr de vouloir supprimer cet article ?'
          },
          messages: {
            noArticles: 'Aucun article trouvé',
            articlesSelected: 'articles sélectionnés',
            loadingError: 'Erreur lors du chargement des articles',
            deleteSuccess: 'Article(s) supprimé(s) avec succès',
            deleteError: 'Erreur lors de la suppression'
          }
        }
      },

      // Public Projects
      projectsPage: {
        headerSubtitle: 'Découvrez et soutenez nos projets en cours qui font une vraie différence.',
        filters: { allTypes: 'Tous les types', distribution: 'Distribution', training: 'Formation', research: 'Recherche', allStatus: 'Tous les statuts', active: 'Actif', draft: 'Brouillon', completed: 'Terminé', reset: 'Réinitialiser' },
        showing: 'Affichage',
        of: 'sur',
        filteredProjects: 'projets filtrés',
        total: 'total',
        none: { empty: 'Aucun projet.', reset: 'Réinitialiser les filtres' },
        pagination: { rows: 'Lignes :', prev: 'Préc', next: 'Suiv' }
      },

      // Public Contact
      contact: {
        title: "Contactez l'équipe",
        subtitle: 'Questions sur les projets, partenariats, bénévolat, dons ou médias ? Écrivez-nous — nous répondons à chaque message.',
        form: {
          name: 'Nom *',
          email: 'Email *',
          inquiryType: 'Type de demande',
          subject: 'Objet *',
          message: 'Message *',
          placeholders: { name: 'Votre nom complet', email: 'vous@exemple.com', subject: 'Sujet bref', message: 'Votre message...' },
          types: { general: 'Demande générale', partnership: 'Partenariat', volunteer: 'Bénévolat', donation: 'Don', media: 'Médias' },
          send: 'Envoyer le message',
          sent: 'Message envoyé !'
        },
        details: {
          title: 'Coordonnées', personRole: 'Personne de contact & rôle', email: 'Email', phone: 'Téléphone', address: 'Adresse',
          addressLines: {
            line1: 'Siège à Dunkirk, Maryland, USA',
            line2: 'Province/État : Maryland (USA)',
            line3: 'Territoire/District : Siège : Dunkirk'
          },
          officeHours: 'Heures de bureau',
          weekday: 'Lun–Ven', saturday: 'Samedi', sunday: 'Dimanche', closed: 'Fermé'
        },
        social: { title: 'Suivre & partager', facebook: 'Facebook', twitter: 'Twitter / X', whatsapp: 'WhatsApp', instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn' },
        cta: { title: 'Partenariat pour faire avancer la dignité et l’éducation menstruelles.', donate: 'Faire un don' }
      },

      // E-learning index
      elearningIndex: {
        title: 'E-learning',
        subtitle: 'Leçons pratiques et gratuites sur la santé menstruelle — réutilisable, usage sûr et dignité. Aucun login requis.',
        search: 'Rechercher des leçons...',
        topic: 'Sujet',
        level: 'Niveau',
        length: 'Durée',
        sort: { newest: 'Trier : plus récent', oldest: 'Plus ancien', shortest: 'Le plus court', longest: 'Le plus long' },
        reset: 'Réinitialiser',
        noResults: 'Aucun résultat. Effacer les filtres.',
        retry: 'Réessayer',
        startReading: 'Commencer la lecture →',
        newsletter: { title: 'Restez informé — nouvelles leçons chaque mois.', emailPlaceholder: 'Votre adresse email', subscribe: 'S’abonner' },
        donateBanner: { title: 'Soutenir des contenus e-learning libres et ouverts.', donate: 'Faire un don' },
        pagination: { rows: 'Lignes :', page: 'Page', prev: 'Préc', next: 'Suiv' }
      },

      // Transparency extras
      transparencyExtras: {
        filterByType: 'Filtrer par type',
        filterByStatus: 'Filtrer par statut',
        questions: 'Des questions sur notre transparence ?',
        promise: 'Nous nous engageons à une transparence totale. Contactez-nous pour des rapports financiers détaillés ou des mises à jour de projet.',
        contactUs: 'Nous contacter',
        downloadAnnual: 'Télécharger le rapport annuel'
      },

      // Public Donation
      donation: {
        title: 'Gardons les filles en classe chaque mois',
        subtitle: 'Votre don finance des kits menstruels, des sessions scolaires et des améliorations WASH de base pour qu’aucune fille ne manque les cours à cause de ses règles.',
        impactTiers: {
          kit: '1 kit d’hygiène menstruelle pour 6 mois',
          training: 'Formation complète pour une classe de 30 élèves',
          facilities: 'Équiper une école avec des installations adaptées'
        },
        yourDonation: 'Votre don',
        donationType: 'Type de don',
        oneTime: 'Ponctuel',
        monthly: 'Mensuel',
        mostImpact: 'Plus d’impact',
        amountLabel: 'Montant (USD) – soutient kits & éducation',
        enterCustomAmount: 'Entrer un montant personnalisé',
        focusArea: 'Domaine de soutien',
        donationSummary: 'Don {{type}} :',
        focusPrefix: 'Focus :',
        donorInformation: 'Informations donateur',
        fields: {
          firstName: 'Prénom *',
          lastName: 'Nom *',
          email: 'Email *',
          phoneOptional: 'Téléphone (optionnel)',
          addressOptional: 'Adresse (optionnel)',
          city: 'Ville',
          country: 'Pays',
          anonPlaceholder: 'Anonyme',
          anonDash: '—',
          emailOptionalNoReceipt: 'Optionnel (aucun reçu ne sera envoyé)',
          emailForReceipt: 'Pour le reçu de don'
        },
        anonymousLabel: 'Rendre ce don anonyme',
        anonymousHint: "Nous ne stockerons pas votre nom ni votre email. Si vous entrez un email, il ne servira qu’à envoyer un reçu.",
        taxTitle: 'Déductible des impôts :',
        taxBody: 'Votre don est déductible des impôts dans la limite de la loi. Vous recevrez un reçu par email pour vos dossiers.',
        payButton: 'Donner ${{amount}} avec Stripe',
        preparingCheckout: 'Préparation du paiement sécurisé...',
        secureProcessing: 'Traitement de paiement sécurisé par Stripe',
        infoSafe: 'Vos informations sont sûres et chiffrées',
        otherWaysTitle: 'Autres façons de soutenir la dignité',
        volunteerTitle: 'Bénévolat',
        volunteerDesc: 'Aider lors des journées de distribution ou des sessions éducatives.',
        spreadTitle: 'Faire passer le mot',
        spreadDesc: 'Normaliser les conversations sur la santé menstruelle dans votre réseau.',
        corporateTitle: 'Partenariat d’entreprise',
        corporateDesc: 'Sponsoriser des kits ou financer un lot d’améliorations WASH scolaires.',
        contactUs: 'Nous contacter',
        transparencyTitle: 'Promesse de transparence',
        transparencyDesc: 'Nous croyons en la transparence. Suivez l’utilisation de votre don via des rapports détaillés et un suivi d’impact.',
        viewReports: 'Voir les rapports',
        devNoticeTitle: 'Avis',
        devNoticeBody: 'C’est en cours de développement.',
        close: 'Fermer'
      },
      // Navigation
      nav: {
        projects: 'Projets',
        about: 'À propos',
        resources: 'Ressources',
        blog: 'Blog',
        contact: 'Contact',
        donate: 'Faire un don',
        signin: 'Se connecter',
  signup: 'S\'inscrire',
  menuToggle: 'Ouvrir/fermer le menu',
  menu: 'Menu',
  close: 'Fermer le menu'
      },
      
      // Landing Page
      landing: {
  title: 'Transformons l\'éducation menstruelle en Afrique',
  subtitle: 'Nous brisons les tabous, éduquons les communautés et offrons des solutions durables pour que chaque jeune fille vive ses règles avec dignité.',
  valueProp: 'Parce qu\'aucune fille ne devrait manquer l\'école à cause de ses règles',
        description: 'Rejoignez-nous pour créer un changement durable grâce à des projets innovants qui fournissent éducation, ressources et opportunités aux communautés du monde entier.',
        exploreProjects: 'Explorer les projets',
        makeDonation: 'Faire un don',
        featuredProjects: 'Projets en vedette',
        featuredDescription: 'Découvrez les projets qui font une vraie différence dans les communautés du monde entier',
  // New human-like single line section titles (FR)
  whyTitle: 'Une éducation vécue dans la dignité transforme l’avenir d’une fille.',
  storiesTitle: 'Découvrez des voix et des moments authentiques du terrain.',
  featuredProjectsTitle: 'Choisissez un projet qui vous parle et suivez son évolution.',
  momentsTitle: 'Des kits cousus localement, des femmes qui mènent, des filles qui gardent leurs journées.',
  imagesDisclaimer: 'Images présentées = illustrations provisoires pour le prototype.',
        nav_mh: {
          projects: 'Projets santé menstruelle',
          resources: 'Ressources santé menstruelle',
          blog: 'Histoires & Perspectives',
          elearning: 'E-learning (santé menstruelle)',
          about: 'Notre mission santé menstruelle'
        },
  howTitle: 'Voyez comment votre soutien devient un impact mesurable.',
  partnersTitle: 'Nous avançons main dans la main avec des partenaires locaux engagés.',
      },
      audience: {
        labels: {
          beneficiaries: 'Bénéficiaires',
          donors: 'Donateurs',
          partners: 'Partenaires'
        },
        beneficiaries: {
          sectionTitle: 'Ton parcours vers la confiance',
          p1: 'Découvre ton corps sans honte',
          p2: 'Apprends avec des formatrices qui te comprennent',
          p3: 'Reçois des kits d\'hygiène gratuits et durables',
          p4: 'Rejoins une communauté de sœurs solidaires'
        },
        donors: {
          sectionTitle: 'Votre impact concret',
          i1: '15$ = 1 kit d\'hygiène menstruelle pour 6 mois',
          i2: '50$ = Formation complète d\'une classe de 30 élèves',
          i3: '100$ = Équipement d\'une école avec des infrastructures adaptées',
          transparency: 'Suivez chaque franc jusqu\'aux mains des bénéficiaires'
        },
        partners: {
          sectionTitle: 'Construisons ensemble',
          i1: 'Écoles : Intégrer l\'éducation menstruelle et des espaces adaptés',
          i2: 'ONG & associations : Organiser production et distribution des kits',
          i3: 'Leaders communautaires & religieux : Briser le silence et porter la dignité des filles'
        },
        overview: {
          title: 'Parcours, impact et collaboration'
        },
        pedagogy: {
          sectionTitle: 'Approche pédagogique visible',
          i1: 'Méthode participative adaptée aux réalités culturelles',
          i2: 'Formation en langues locales avec supports visuels',
          i3: 'Sessions mixtes parents–filles pour lever les tabous familiaux'
        },
        menstrualHealth: {
          sectionTitle: 'Santé menstruelle sans détour',
          i1: 'Hygiène menstruelle : prévention des infections',
          i2: 'Gestion de la douleur avec méthodes naturelles',
          i3: 'Quand consulter : signaux d\'alerte expliqués simplement'
        }
      },
      
      // Authentication
      auth: {
        login: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié ?',
        signin: 'Se connecter',
        noAccount: 'Vous n\'avez pas de compte ?',
        signup: 'S\'inscrire',
        enterEmail: 'Entrez votre email',
        enterPassword: 'Entrez votre mot de passe'
      },

      // Workflow Diagram (utilisé dans LandingPage)
      workflow: {
        define: {
          title: 'Définir',
          desc: 'Fixer les objectifs et planifier'
        },
        donate: {
          title: 'Donner',
          desc: 'Fonds alloués'
        },
        produce: {
          title: 'Produire',
          desc: 'Les femmes locales fabriquent les kits'
        },
        distribute: {
          title: 'Distribuer',
          desc: 'Kits livrés et enregistrés'
        },
        educate: {
          title: 'Éduquer',
          desc: 'Sessions d\'apprentissage d\'hygiène'
        }
      },

      // Interface commune
      ui: {
        mode: {
          light: 'Clair',
          dark: 'Sombre',
          toggle: 'Basculer le mode sombre',
          switchToLight: 'Passer en mode clair',
          switchToDark: 'Passer en mode sombre'
        }
      },
      
      // Admin Dashboard
      admin: {
        dashboard: 'Tableau de bord',
        projectsNav: 'Projets',
        suppliers: 'Fournisseurs',
        distributors: 'Distributeurs',
        beneficiaries: 'Bénéficiaires',
  finances: 'Finances',
        totalDonations: 'Total des dons',
        thisMonth: 'Ce mois',
        avgDonation: 'Don moyen',
        monthlyTrend: 'Tendance mensuelle des dons',
        recentActivity: 'Activité récente des donateurs',
        monthlyDonation: 'Don mensuel',
        oneTimeDonation: 'Don ponctuel',
        description: 'Vue d\'ensemble financière et transactions',
  donors: 'Donateurs',
        elearning: 'E-learning',
    blog: 'Blog',
    gallery: 'Galerie',
        resources: 'Ressources',
        research: 'R&D',
  team: 'Équipe',
          nav_mh: {
            projects: 'Projets santé menstruelle',
            resources: 'Ressources santé menstruelle',
            blog: 'Histoires & Perspectives',
            elearning: 'E-learning (santé menstruelle)',
            about: 'Notre mission santé menstruelle'
          },
  admin: 'Admin',
        settings: 'Paramètres',
        welcome: 'Bon retour ! Voici ce qui se passe avec vos projets.',
        totalProjects: 'Total des projets',
        activeProjects: 'Projets actifs',
        totalRaised: 'Total collecté',
        fundingProgress: 'Progrès du financement',
        recentProjects: 'Projets récents',
        recentDonations: 'Dons récents',
  noMessage: 'Aucun message',
        // Jessica Dashboard
        jessicaWelcome: 'Construire la dignité par l\'éducation — voici votre aperçu d\'impact.',
        impact: {
          girlsTrained: 'Filles formées',
          kitsDistributed: 'Kits distribués',
          schoolAttendance: 'Taux de présence scolaire',
          communityReach: 'Portée communautaire (miles)',
          monthlyProgress: 'Progression mensuelle',
          impactGrowth: 'Croissance d\'impact',
          communityFeedback: 'Retours communautaires',
          projectMilestones: 'Jalons de projet'
        },
        projects: {
          jessicaActive: 'Projets actifs de Jessica',
          completed: 'Terminés',
          inProgress: 'En cours',
          planning: 'Planification'
        },
        recentActivities: {
          title: 'Activités récentes',
          training: 'Session de formation',
          distribution: 'Distribution de kits',
          meeting: 'Rencontre communautaire',
          report: 'Rapport d\'impact',
          noActivities: 'Aucune activité récente'
        },
  ui: {
          groups: {
            operations: 'Opérations & Projets',
            finance: 'Finances & Donateurs',
            content: 'Contenu & Apprentissage',
            governance: 'Gouvernance & Administration'
          },
          quick: {
            dashboard: 'Dashboard'
          },
          table: {
            recentItems: 'Éléments récents',
            date: 'Date',
            type: 'Type',
            reference: 'Référence',
            status: 'Statut',
            amount: 'Montant',
          projectCard: {
            supportCta: 'Avancer la santé menstruelle',
            supportCtaLong: 'Avancer la santé menstruelle & la dignité',
            locationFrom: 'Lieu',
            funded: 'financé'
          },
            actions: 'Actions',
            searchPlaceholder: 'Rechercher...'
          },
          filters: {
            all: 'Tous',
            period30: '30j',
            period90: '90j',
            period365: '365j'
          },
          status: {
            success: 'réussi',
            pending: 'en cours',
            submitted: 'soumis',
            validated: 'validé',
            refunded: 'remboursé',
            rejected: 'rejeté',
            draft: 'draft',
            active: 'actif'
          },
          types: {
            project: 'projet',
          blog: {
            kpis: {
              total: 'Total articles',
              drafts: 'Drafts',
              published: 'Published',
              views30: 'Views (30d)'
            }
          },
          gallery: {
            categories: {
              all: 'All Images',
              education: 'Education',
              distribution: 'Distribution',
              impact: 'Impact Stories',
              community: 'Community'
            },
            stats: {
              total: 'Total Images',
              public: 'Public',
              private: 'Private',
              education: 'Education'
            },
            upload: 'Upload Images',
            search: 'Search images...',
            empty: {
              title: 'No Images Found',
              search: 'No images match your search criteria.',
              category: 'No images in this category yet.'
            },
            uploadAction: {
              first: 'Upload Your First Image'
            },
            fields: {
              title: 'Title',
              description: 'Description',
              category: 'Category',
              tags: 'Tags',
              isPublic: 'Make Public'
            },
            actions: {
              edit: 'Edit',
              delete: 'Delete',
              toggleVisibility: 'Toggle Visibility',
              makePublic: 'Make Public',
              makePrivate: 'Make Private'
            },
            uploadModal: {
              title: 'Upload Images',
              selectFiles: 'Select Images',
              selectHint: 'Choose one or more images to upload to the gallery',
              addMetadata: 'Add Metadata',
              uploading: 'Uploading Images...',
              uploadingHint: 'Please wait while we upload your images',
              complete: 'Upload Complete',
              completeHint: 'Your images have been uploaded to the gallery',
              start: 'Upload Images'
            },
            edit: {
              title: 'Edit Image',
              confirmClose: 'You have unsaved changes. Are you sure you want to close?',
              saveError: 'Save Error',
              saving: 'Saving changes...',
              unsavedChanges: 'You have unsaved changes'
            }
          },
          donors: {
            kpis: { total: 'Total donors', collected: 'Collected', average: 'Average donation', top: 'Top donor' },
            filters: {
              anon: { all: 'All', yes: 'Anonymous', no: 'Identified' },
              dest: { all: 'All destinations', general: 'General fund', project: 'Projects' },
              country: 'Country'
            },
            table: { name: 'Name', email: 'Email', count: 'Donations', total: 'Total', last: 'Last' },
            viewProfile: 'View profile',
            anon: 'Anon.'
          },
            donation: 'don',
            report: 'rapport'
          },
            actions: {
              view: 'voir',
              edit: 'éditer',
              validate: 'valider',
              help: 'Aide',
              logout: 'Se déconnecter',
              exportCsv: 'Exporter CSV',
              publish: 'Publier',
              unpublish: 'Dépublier',
              publishSelected: 'Publier sélection',
              bulk: 'Actions en masse'
            },
            resources: {
              kpis: {
                total: 'Total documents',
                pending: 'En attente de validation',
                published: 'Publiés (public)',
                retired: 'Retirés/archivés'
              },
              filters: {
                type: 'Type',
                year: 'Année',
                visibility: 'Visibilité'
              },
              language: 'Langue',
              size: 'Taille',
              visibility: { label: 'Visibilité', public: 'Public', internal: 'Interne' },
              status: { retired: 'Retiré' },
              actions: { retire: 'Retirer', confirmDelete: 'Supprimer cet élément ?' },
              modal: {
                title: 'Téléverser un document (simple)',
                hint: 'Déposez un fichier (optionnel). Les métadonnées suffisent pour la démo.',
                dropHere: 'Glissez-déposez un fichier ici',
                chooseFile: 'Choisir un fichier',
                file: 'Fichier',
                change: 'Changer',
                desc: 'Description (courte)',
                descPlaceholder: 'Affichée sur la page publique',
                placeholders: { title: 'Titre du document' }
              }
            },
            donors: {
              kpis: { total: 'Total donateurs', collected: 'Collecté', average: 'Don moyen', top: 'Top donateur' },
              filters: {
                anon: { all: 'Tous', yes: 'Anonyme', no: 'Identifié' },
                dest: { all: 'Toutes destinations', general: 'Fonds général', project: 'Projets' },
                country: 'Pays'
              },
              table: { name: 'Nom', email: 'Email', count: 'Dons', total: 'Total', last: 'Dernier' },
              viewProfile: 'Voir profil',
              anon: 'Anonyme',
              profile: {
                title: 'Profil donateur',
                notFound: 'Donateur introuvable.',
                history: 'Historique des dons',
                destination: 'Destination',
                method: 'Méthode',
                amount: 'Montant',
                requestRefund: 'Demander un remboursement',
                noDonations: 'Aucun don',
                projects: 'Projets soutenus',
                generalOnly: 'Fonds général uniquement',
                refunds: 'Remboursements',
                noRefunds: 'Aucune demande de remboursement.',
                donation: 'Don',
                selectDonation: 'Sélectionner un don',
                reason: 'Motif',
                since: 'Depuis'
              }
            },
          charts: {
            collectePlanDep: 'Collecte vs Planifié vs Dépensé (mensuel)',
            milestones: 'Jalons complétés (%)',
            spendingSplit: 'Répartition des dépenses'
          },
          distributors: {
            listTitle: 'Liste des distributeurs',
            total: 'Total distributeurs',
            contact: 'Contact principal',
            volume: 'Volume distribué (kits)',
            satisfaction: 'Satisfaction moyenne',
            profile: {
              title: 'Profil distributeur',
              notFound: 'Distributeur introuvable.',
              users: 'Utilisateurs',
              addUser: 'Ajouter utilisateur',
              role: 'Rôle',
              lastAccess: 'Dernier accès',
              deactivate: 'Désactiver',
              activate: 'Activer',
              noUsers: 'Aucun utilisateur',
              associatedProjects: 'Projets associés',
              noProjects: 'Aucun projet associé',
              notes: 'Notes',
              agreement: 'Convention',
              lastReport: 'Dernier rapport',
              download: 'Télécharger'
            },
            create: {
              title: 'Nouveau distributeur',
              placeholders: { name: 'Ex : École Kanyosha' },
              contract: 'Convention (optionnel)',
              selected: 'Sélectionné'
            }
          },
          kpis: {
            activeProjects: 'PROJETS ACTIFS',
            collected: 'COLLECTÉ',
            spent: 'DÉPENSÉ',
            beneficiaries: 'BÉNÉFICIAIRES'
          },
          projectsAdmin: {
            total: 'Total projets',
            plannedBudget: 'Budget planifié',
            collected: 'Collecté',
            spent: 'Dépensé',
            execution: 'Exécution',
            table: {
              id: 'ID', name: 'Nom', type: 'Type', organisation: 'Organisation', location: 'Location', dates: 'Dates', status: 'Statut', budget: 'Budget', collected: 'Collecté', spent: 'Dépensé'
            },
            filters: {
              type: 'Type', status: 'Statut', country: 'Pays', org: 'Org', period: 'Période'
            },
            create: {
              title: 'Créer un nouveau projet',
              name: 'Nom du projet',
              placeholderName: 'Ex: Gitega School Dignity Kits',
              manager: 'Chef de projet',
              operators: 'Opérateurs terrain',
              type: 'Type',
              org: 'Organisation (type + entité)',
              organisationType: 'Type',
              organisationEntity: 'Entité',
              dates: 'Dates',
              startDate: 'Date début',
              endDate: 'Date fin',
              location: 'Location',
              country: 'Pays',
              state: 'Province/État',
              city: 'Ville',
              template: 'Template (si distribution/formation)',
              description: 'Description',
              plannedBudget: 'Budget planifié total (USD)',
              code: 'Code projet (auto)',
              createdBy: 'Créé par',
              createdAt: 'Créé le',
              tipRequired: 'Astuce : les champs marqués * sont obligatoires. Les erreurs s\'affichent sous les champs.',
              saveDraft: 'Enregistrer brouillon',
              create: 'Créer',
              createContinue: 'Créer & continuer',
              cancel: 'Annuler',
              operatorsPlaceholder: 'Ajouter/supprimer des opérateurs',
              required: 'Champ requis',
              budgetInvalid: 'Budget invalide',
              shortDescription: 'Courte description',
              coverImage: 'Image de couverture',
              videoUrl: 'URL vidéo',
              initialCollected: 'Collecté initial (USD)',
              coverRequired: 'Image de couverture requise'
              ,videoSource: 'Source vidéo'
              ,videoFile: 'Fichier vidéo'
              ,sourceUrl: 'Lien'
              ,sourceUpload: 'Téléverser'
              ,removeVideo: 'Supprimer la vidéo'
              ,type_blank: 'Blank'
              ,type_distribution: 'Distribution'
              ,type_formation: 'Formation'
              ,type_recherche_dev: 'Recherche & Développement'
              ,type_achat: 'Achat'
              ,type_hybride: 'Hybride (Distribution + Formation)'
              ,operatorsLabel: 'Opérateurs terrain'
              ,primaryOperator: 'Opérateur principal'
              ,operatorsRequired: 'Choisissez au moins un opérateur'
              ,primaryOperatorRequired: 'Sélectionnez un opérateur principal'
              ,operatorSearch: 'Rechercher un opérateur...'
              ,orgType_ong: 'ONG'
              ,orgType_ecole: 'École'
              ,orgType_association: 'Association'
              ,orgType_institution: 'Institution'
              ,orgType_organisation: 'Organisation'
              ,detail_tabs_resume: 'Résumé'
              ,detail_tabs_plan: 'Plan'
              ,detail_tabs_production: 'Production'
              ,detail_tabs_distribution: 'Distribution'
              ,detail_tabs_formation: 'Formation'
              ,detail_tabs_transparency: 'Transparence'
              ,detail_tabs_depenses: 'Dépenses'
              ,detail_tabs_rapports: 'Rapports'
              ,detail_tabs_beneficiaires: 'Bénéficiaires'
              ,detail_checklist_title: 'Checklist — Prochaines étapes'
              ,detail_project_info: 'Infos projet'
              ,detail_quick_actions: 'Actions rapides'
              ,action_open_production: 'Ouvrir Production'
              ,action_open_distribution: 'Ouvrir Distribution'
              ,action_add_expense: 'Ajouter dépense'
              ,action_upload_report: 'Téléverser rapport'
              ,action_import_beneficiaries: 'Importer bénéficiaires'
              ,action_export_pdf: 'Exporter PDF'
            }
            , newProject: 'Nouveau projet'
          },
          blog: {
            kpis: {
              total: 'Total articles',
              drafts: 'Brouillons',
              published: 'Publiés',
              views30: 'Vues (30j)'
            },
            filters: {
              all: 'Tous',
              published: 'Publiés',
              draft: 'Brouillons',
              archived: 'Archivés'
            },
            actions: {
              bulkDelete: 'Supprimer sélectionnés',
              confirmDelete: 'Supprimer les articles sélectionnés ?'
            }
          },
          months: {
            jan: 'Jan',
            feb: 'Fév',
            mar: 'Mar',
            apr: 'Avr',
            may: 'Mai',
            jun: 'Juin',
            jul: 'Juil',
            aug: 'Aoû',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Déc'
          }
        }
      },
      
      // Common
      common: {
        search: 'Rechercher...',
        notifications: 'Notifications',
        loading: 'Chargement...',
        error: 'Erreur',
        retry: 'Réessayer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        view: 'Voir',
        create: 'Créer',
        update: 'Mettre à jour',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        learnMore: 'En savoir plus',
        viewAll: 'Voir tout',
        progress: 'Progrès',
        close: 'Fermer',
        open: 'Ouvrir',
        select: 'Sélectionner',
        filter: 'Filtrer',
        sort: 'Trier',
        export: 'Exporter',
        import: 'Importer',
        upload: 'Téléverser',
        download: 'Télécharger',
        // Admin table/common fields
        title: 'Titre',
        category: 'Catégorie',
        tags: 'Tags',
        author: 'Auteur',
        updated: 'MAJ',
        level: 'Niveau',
        duration: 'Durée',
        rows: 'Lignes',
        noResults: 'Aucun résultat',
        done: 'Terminé',
        reset: 'Réinitialiser'
      },
      
      // Transparency
      transparency: {
        title: 'Transparence & Responsabilité',
        subtitle: 'Suivez la progression et l\'impact de chaque projet. Nous croyons en une transparence totale.',
        kpis: {
          planned: 'Budget Prévu',
          collected: 'Collecté',
          spent: 'Dépensé',
          gap: 'Manque de Financement',
          beneficiaries: 'Bénéficiaires'
        },
        chart: {
          monthlyOverview: 'Vue Financière Mensuelle',
          legend: {
            planned: 'Prévu',
            collected: 'Collecté',
            blog: {
              kpis: {
                total: 'Articles totaux',
                drafts: 'Brouillons',
                published: 'Publiés',
                views30: 'Vues (30j)'
              }
            },
            gallery: {
              categories: {
                all: 'Toutes les images',
                education: 'Éducation',
                distribution: 'Distribution',
                impact: 'Histoires d\'impact',
                community: 'Communauté'
              },
              stats: {
                total: 'Images totales',
                public: 'Publiques',
                private: 'Privées',
                education: 'Éducation'
              },
              upload: 'Téléverser des images',
              search: 'Rechercher des images...',
              empty: {
                title: 'Aucune image trouvée',
                search: 'Aucune image ne correspond à vos critères.',
                category: 'Aucune image dans cette catégorie pour le moment.'
              },
              uploadAction: {
                first: 'Téléverser votre première image'
              },
              fields: {
                title: 'Titre',
                description: 'Description',
                category: 'Catégorie',
                tags: 'Tags',
                isPublic: 'Rendre public'
              },
              actions: {
                edit: 'Modifier',
                delete: 'Supprimer',
                toggleVisibility: 'Basculer la visibilité',
                makePublic: 'Rendre public',
                makePrivate: 'Rendre privé'
              },
              uploadModal: {
                title: 'Téléverser des images',
                selectFiles: 'Sélectionner des images',
                selectHint: 'Choisissez une ou plusieurs images à téléverser dans la galerie',
                addMetadata: 'Ajouter des métadonnées',
                uploading: 'Téléversement en cours...',
                uploadingHint: 'Veuillez patienter pendant le téléversement de vos images',
                complete: 'Téléversement terminé',
                completeHint: 'Vos images ont été téléversées dans la galerie',
                start: 'Téléverser les images'
              },
              edit: {
                title: 'Modifier l\'image',
                confirmClose: 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir fermer ?',
                saveError: 'Erreur de sauvegarde',
                saving: 'Sauvegarde en cours...',
                unsavedChanges: 'Vous avez des modifications non sauvegardées'
              }
            },
            spent: 'Dépensé'
          },
          month: 'Mois'
        },
        expenses: {
          title: 'Dépenses',
          category: 'Catégorie',
          amount: 'Montant',
          date: 'Date',
          filterCategory: 'Filtrer Catégorie',
          filterMonth: 'Filtrer Mois',
          noData: 'Aucune dépense trouvée'
        },
        milestones: 'Jalons du Projet',
        documents: 'Documents Disponibles',
        financialBreakdown: 'Répartition Financière',
        budgetUtilization: 'Utilisation du Budget',
        remaining: 'Restant',
        projectProgress: 'Progression du Projet',
        viewDetails: 'Voir les détails',
        hideDetails: 'Masquer les détails'
      },
      // Newsletter
      newsletter: {
        title: 'Newsletter',
        description: 'Inscrivez-vous pour des mises à jour mensuelles.',
        placeholder: 'vous@exemple.com',
        cta: 'S\'inscrire',
        success: 'Merci ! Vérifiez votre email.',
        invalid: 'Adresse invalide',
        failure: 'Échec, réessayez',
        privacy: 'Protection des données : désabonnement en un clic dans chaque email.'
      }
      ,education: {
        title: 'Pourquoi l\'éducation à la santé menstruelle compte',
  lead: 'Savoir et dignité gardent les filles à l\'école.',
    p1: 'Sans informations claires, des filles manquent des cours, subissent la stigmatisation ou utilisent des solutions risquées. Les kits aident et la formation donne confiance.',
  p2: 'Animatrices locales : hygiène, réutilisation, moins de honte. Cours en ligne et blog renforcent. Cet appui combiné garde les filles présentes et équipées.',
  cta: 'Voir plus de contenu sur la santé menstruelle'
      }
      ,aboutPage: {
        hero: {
          title: 'À propos d\'Educate4Dignity',
          subtitle: 'Nous brisons les tabous, éduquons les communautés et proposons des solutions réutilisables et durables pour que chaque fille vive ses règles avec dignité.'
        },
        video: {
          aria: 'Vidéo de présentation de l\'organisation',
          unsupported: 'Votre navigateur ne supporte pas la vidéo.',
          caption: 'Extrait d\'une session de distribution à l\'école, capturant l\'énergie lorsque les filles reçoivent leurs kits et des conseils.'
        },
        mission: {
          title: 'Notre mission',
          body: 'Au Burundi et dans l\'Afrique de l\'Est, trop d\'élèves manquent des cours pendant leurs règles, non par manque de motivation, mais à cause du coût, du silence, d\'installations WASH insuffisantes et d\'un accompagnement limité.',
          bullets: {
            education: 'Éducation : un apprentissage clair et sans stigmatisation sur la santé menstruelle.',
            access: 'Accès : kits réutilisables et matériaux locaux, durables.',
            facilities: 'Infrastructures (WASH) : intimité, eau et lavage des mains adaptés aux contextes scolaires réels.',
            capacity: 'Capacités locales : co‑construire avec coopératives, enseignants et agents de santé.'
          }
        },
        vision: {
          title: 'Notre vision',
          body: 'Une région où l\'éducation de chaque élève n\'est jamais interrompue par les règles, où dignité, santé et opportunité sont la norme en classe.',
          bullets: {
            schools: 'Chaque école dotée d\'une éducation pratique à la santé menstruelle et d\'infrastructures WASH.',
            production: 'Une production locale portée par des femmes, rendant les solutions réutilisables abordables.',
            transparency: 'Des données d\'impact transparentes partagées pour accélérer ce qui fonctionne.'
          }
        },
        approach: {
          whyTitle: 'Pourquoi c\'est important',
          whyBody: 'L\'éducation retarde les mariages précoces, améliore la santé et renforce la résilience communautaire. Une serviette n\'est pas toute la réponse, mais sans elle trop d\'avenirs se rétrécissent.',
          howTitle: 'Notre manière d\'agir',
          howBody: 'Écouter d\'abord, co‑concevoir avec écoles et coopératives, documenter tôt, publier ouvertement et itérer pour créer un appui réplicable.',
          valueTitle: 'Ce que nous valorisons',
          valueBody: 'Dignité, transparence et intelligence locale. Nous levons les barrières de santé de base pour que l\'éducation ne s\'interrompe pas.'
        },
        founder: {
          title: 'Mot de la fondatrice',
          p1: 'J\'ai commencé à écouter les filles à Bujumbura en 2023. Le constat était simple et douloureux : curiosité et ambition bloquées par une serviette absente. Qu\'une fourniture de base détermine la confiance scolaire est inacceptable.',
          p2: 'Notre approche : prototyper des solutions modestes mais rapides, partager des données et élargir les partenariats, en centrant toujours l\'expérience de l\'élève. La biologie ne doit pas décider qui s\'assied en classe.',
          quote: 'La dignité n\'est pas un luxe. C\'est l\'infrastructure discrète de l\'apprentissage.'
        },
        team: {
          title: 'Équipe',
          roles: {
            opsTitle: 'Responsable opérations',
            opsBody: 'Logistique des programmes et coordination des coopératives.',
            opsAlt: 'Responsable opérations supervisant les distributions',
            finTitle: 'Finances & conformité',
            finBody: 'Discipline budgétaire, rapports transparents.',
            finAlt: 'Spécialiste finances et conformité',
            eduTitle: 'Éducation & recherche',
            eduBody: 'Contenus MHM, conception des formations, suivi.',
            eduAlt: 'Animatrice éducation & recherche'
          },
          disclaimer: 'Images provisoires : à remplacer par des photos consenties en production.'
        },
        cta: {
          title: 'Rejoignez-nous pour restaurer la dignité',
          donate: 'Faire un don'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
