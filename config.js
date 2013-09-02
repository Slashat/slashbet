var test = {
  database_url: 'postgres://stenehall:@127.0.0.1/slashbet_test',
  auth: {
    github: {
      clientID: '61f1b46a2a920718343e',
      clientSecret : '82b89a3d2c5256c88e53d62fde7febe93e8c971c',
      clientCallback : "http://0.0.0.0:3000/auth/github/callback"
    }
  }
};

var development = {
  database_url: process.env.DATABASE_URL,
  auth: {
    github: {
      clientID: '61f1b46a2a920718343e',
      clientSecret : '82b89a3d2c5256c88e53d62fde7febe93e8c971c',
      clientCallback : "http://0.0.0.0:3000/auth/github/callback"
    }
  }
};

var production = {
  database_url: process.env.DATABASE_URL,
  auth: {
    github: {
      clientID : 'a777f91dd262e22b5d22', // Needs to be extracted to ENV
      clientSecret : '6f4cc0339e3f460a22a8f0a952930f0ba225d3fe', // Needs to be extracted to ENV
      clientCallback : "http://bet.slashat.se/auth/github/callback"
    }
  }
};

switch (global.process.env.NODE_ENV) {
  case 'production':
    exports.Config = production;
    break;
  case 'test':
    exports.Config = test;
    break;
  default:
    exports.Config = development;
    break;
}

//exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;
