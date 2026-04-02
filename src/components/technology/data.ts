export type TechnologyItem = {
  id: string
  title: string
  icon: string
  description: string
}

export type TechnologySection = {
  id: string
  label: string
  title: string
  items: TechnologyItem[]
}

export const technologySections: TechnologySection[] = [
  {
    id: 'environments',
    label: 'Environments',
    title: 'Environments / Frameworks',
    items: [
      {
        id: 'nodejs',
        title: 'Node.js / Socket.io',
        icon: '/images/favicons/node.png',
        description:
          'Node.js is an open source JavaScript runtime environment that can be used for developing client-side and server-side applications. It has an event-drive architecture that makes it very useful for near-real-time communication in the browser.',
      },
      {
        id: 'composer',
        title: 'PHP / Composer / Laravel / WordPress',
        icon: '/images/favicons/laraval.jpg',
        description:
          'Composer is a PHP package manager that provides access to a myriad of libraries with just a few clicks. We love PHP and generally use the Laravel framework, however we have experience with many other PHP frameworks as well.',
      },
      {
        id: 'html5',
        title: 'HTML5 / CSS3 / JavaScript',
        icon: '/images/favicons/html5.png',
        description:
          "HTML5 is the current web standard we have all come to know and love. We have extensive experience building HTML5 User Interfaces (UX) that make use of JavaScript and CSS3's capabilities.",
      },
      {
        id: 'angular',
        title: 'Javascript / Angular / Vue / jQuery / Etc...',
        icon: '/images/favicons/angular.ico',
        description:
          'We have experience working with many different front-end platforms, frameworks, and libraries. We are experts in Ajax, Websockets, WebRTC, LocalStorage, and more.',
      },
      {
        id: 'python',
        title: 'Python / Twistd / Django / Etc...',
        icon: '/images/favicons/py.png',
        description:
          'Python is a great language and we make use it whenever appropriate. We have experience working with Twisted, Django, and more.',
      },
      {
        id: 'ionic',
        title: 'Ionic / Phonegap / Cordova',
        icon: '/images/favicons/ionic.png',
        description:
          'Our developers are experts in responsive design and creating mobile and desktop WebView applications. We have been using Apache Cordova since before PhoneGap was purchased by Adobe Systems. These tools allow us to create cross-platform web applications for any organization.',
      },
      {
        id: 'ruby',
        title: 'Ruby on Rails',
        icon: '/images/favicons/ruby.ico',
        description:
          "We have experience building and maintaining Ruby on Rails applications. We're also familiar with Active Record, and paradigms such as convention over configuration or don't repeat yourself.",
      },
    ],
  },
  {
    id: 'database',
    label: 'Database Engines',
    title: 'Database Engines',
    items: [
      {
        id: 'mysql',
        title: 'MySQL / MariaDB',
        icon: '/images/favicons/mysql.ico',
        description:
          'Our engineers are data experts and can build, upgrade, or maintain your relational database(s). We understand SQL security and query optmiziation well, and will structure your database / application architecture in an efficient manner.',
      },
      {
        id: 'postgres',
        title: 'PostgreSQL',
        icon: '/images/favicons/postgres.ico',
        description:
          'Our engineers are data experts and can build, upgrade, or maintain your relational database(s). We understand SQL security and query optmiziation well, and will structure your database / application architecture in an efficient manner.',
      },
      {
        id: 'nosql',
        title: 'NoSQL / MongoDB / Redis / Memcached',
        icon: '/images/favicons/redis.png',
        description:
          'We understand when and how to use NoSQL and Memory-Caching solutions in order to optimize performance on high-use applications.',
      },
      {
        id: 'csv',
        title: "CSV's, AccessDB, and more!",
        icon: '/images/favicons/csv.png',
        description:
          'We understand when and how to use NoSQL and Memory-Caching solutions in order to optimize performance on high-use applications.',
      },
    ],
  },
  {
    id: 'template',
    label: 'Template Engines',
    title: 'Template Engines',
    items: [
      {
        id: 'bootstrap',
        title: 'Bootstrap',
        icon: '/images/favicons/bootstrap.ico',
        description:
          'Bootstrap is a great HTML5 template engine that is at the core of a large number of websites online today. We understand the Stylesheets, JavaScript, and other Components well and can customize a new template to your exact specifications.',
      },
      {
        id: 'md',
        title: 'Material Design',
        icon: '/images/favicons/materialdesign.png',
        description:
          'Material Design is a design language developed by Google that is a good starting point for building a new mobile template or website.',
      },
      {
        id: 'propellerin',
        title: 'Propeller.in',
        icon: '/images/favicons/propellerin.ico',
        description:
          'Propeller.in is a new framework that combines the best features of Bootstrap and Material design into an excellent starting point for new web templates and interfaces.',
      },
    ],
  },
  {
    id: 'servers',
    label: 'Servers',
    title: 'Server Administration',
    items: [
      {
        id: 'linux',
        title: 'Linux (Debian, CentOS, and more)',
        icon: '/images/favicons/linux.png',
        description:
          'We understand server administration well and can help you setup or maintain any type of Linux or Windows Server. We are experts at SSH and can write custom bash scripts and setup software daemons for you.',
      },
      {
        id: 'windows',
        title: 'Windows Server 2008 / 2012',
        icon: '/images/favicons/microsoft.ico',
        description:
          'We understand server administration well and can help you setup or maintain any type of Linux or Windows Server. We are experts at SSH and can write custom bash scripts and setup software daemons for you.',
      },
      {
        id: 'apache',
        title: 'Apache / nginx / lighttpd / IIS',
        icon: '/images/favicons/apache.ico',
        description:
          'As master web engineers, we have experience installing, configuring, customizing, and maintaining various types of web servers. We can setup load balancers, reverse/forward proxies, and much more.',
      },
      {
        id: 'virtualization',
        title: 'Virtualization (Docker, XenServer, Oracle VM, etc...)',
        icon: '/images/favicons/docker.png',
        description:
          'Our engineers is comfortable working their way around virtualization technology and can setup any Operating System on as many Virtual Machines necessary to meet your organizational needs.',
      },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    title: 'Network Administration',
    items: [
      {
        id: 'load',
        title: 'Load Balancing / Scalability (clustering, distributed networking, etc...)',
        icon: '/images/favicons/database_network.png',
        description:
          'We are experienced in creating and optimizing distributed computing applications that can handle high-usage loads. Database clustering, RAM caching, and algorithmic performance tweaks will have your application running smoothly even during peak usage times.',
      },
      {
        id: 'p2p',
        title: 'P2P Technology (Blockchain technology, bitcoin, bittorrent, webtorrent, etc...)',
        icon: '/images/favicons/network_cloud.png',
        description:
          'We are passionate about the potential applications that decentralization technology enables, and we of distributed networking protocols behind popular networks like bitcoin and bittorrent.',
      },
      {
        id: 'webrtc',
        title: 'WebRTC, Websockets, Ajax/Http, and more.',
        icon: '/images/favicons/ethernet.png',
        description:
          'We are passionate about the potential applications that decentralization technology enables, and we of distributed networking protocols behind popular networks like bitcoin and bittorrent.',
      },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud Providers',
    title: 'Cloud Providers',
    items: [
      {
        id: 'dedi',
        title: 'Dedicated Servers',
        icon: '/images/favicons/server.png',
        description:
          'We work with several dedicated server providers in various locations throughout the world. Our team can setup your server or server cluster and help you maintain it.',
      },
      {
        id: 'aws',
        title: 'Amazon Web Services, Google Cloud, etc...',
        icon: '/images/favicons/aws.ico',
        description:
          'We have experience building applications on top of popular cloud computer architectures such as AWS, G Cloud, and more.',
      },
      {
        id: 'do',
        title: 'DigitalOcean, Linode, Online.net, etc..',
        icon: '/images/favicons/digitalocean.png',
        description: "We can also setup VPS's on popular providers such as DO, Linode, and more.",
      },
    ],
  },
  {
    id: 'apis',
    label: "API's",
    title: "API's",
    items: [
      {
        id: 'fbgraph',
        title: 'Facebook Graph',
        icon: '/images/favicons/facebook.png',
        description:
          'We have experience building Automatic Posting and Parsing applications that connect with graph.facebook.com for data transfer. Our software can help you automate data processing coming in and out of the Facebook platform.',
      },
      {
        id: 'reddit',
        title: 'Reddit API',
        icon: '/images/favicons/reddit.gif',
        description:
          'We have built Reddit scrapers, posters, bots, and more. Let us build you an automated software solution for communicating with the Reddit platform.',
      },
      {
        id: 'gapi',
        title: "Google API's",
        icon: '/images/favicons/google.png',
        description:
          "Our developers can build custom software solutions for automated interactions with the massive trove of information available through Google's numerous API's.",
      },
    ],
  },
]
