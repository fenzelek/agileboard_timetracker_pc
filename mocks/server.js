const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'data.json'))

server.use(jsonServer.defaults())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cookieParser())

const SECRET_KEY = '123456789'
const JWT_EXPIRATION = 60 * 60 * 24 // 1 day expiration
// Create a token from a payload
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRATION })
}

// Verify the token
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user credentials are valid
function isAuthenticated({ username, password }) {
  const dbUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users.data;
  return dbUsers.findIndex(user => user.user.data.email === username && user.user.data.password === password) !== -1;
}

function userExists(email) {
  const dbUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users
  return dbUsers.findIndex(user => user.email === email) !== -1
}

function updateDbState(file) {
  fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    router.db.assign(file).write();
  });
}

// auth route
server.post('/oauth/token', (req, res) => {
  const { username, password } = req.body
  if (username === 'inactive@email.com') {
    res.status(403).json({ code: 'general.api_error', message: 'Email is not verified.' })
    return;
  }
  if (isAuthenticated({username, password}) === false) {
    res.status(401).json({ code: 'general.no_action_permision', message: 'Incorrect email or password'})
    return
  }
  const access_token = createToken({ username, password })

  res.status(200)
    .cookie('access_token', access_token, { maxAge: JWT_EXPIRATION * 1000, httpOnly: true })
    .json({ access_token })
})

server.post('/auth/logout', (req, res) => {
  res.status(204).json({})
});

// companies
server.get('/users/current/companies', (req, res) => {
  // const authUser = jwt.verify(
  //     req.cookies && req.cookies.access_token ? req.cookies.access_token : '',
  //     SECRET_KEY,
  //     (err, decode) => decode !== undefined ? decode : null
  // );
  const companies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).companies;
  // get data from token-found-user or first from mock-api
  res.status(200).json({ data: companies })
});

// current user
server.get('/users/current', (req, res) => {
  const companies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).current_user;
  // get data from token-found-user or first from mock-api
  res.status(200).json({ data: companies })
});

// tasks
// toggle task list every GET request
let reqCounter = 1;
server.get('/projects/:id/tickets', (req, res) => {
  if (req.method.toUpperCase() === 'GET') {
    reqCounter = reqCounter == 1 ? 2 : 1;
  }
  const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')))[`tasks_${reqCounter}`];
  res.status(200).json(tasks);
});

// sprints
server.get('/projects/:id/sprints', (req, res) => {
  const sprints = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).sprints;
  res.status(200).json(sprints)
});

// users
server.get('/projects/:id/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users;
  res.status(200).json(users)
});

// projects
server.get('/projects', (req, res) => {
  const projects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).projects;
  res.status(200).json(projects)
});


//below to remove
server.post('/api/email/resend', (req, res) => {
  if (req.body.email === 'fail@test.com') {
    res.status(422).json({ code: 'general.not_found', message: 'Email not found' })
    return
  }
  res.status(200).json()
})

server.post('/api/password/email', (req, res) => {
  if (req.body.email === 'fail@test.com') {
    res.status(422).json({ code: 'general.not_found', message: 'Email not found' })
    return
  }
  res.status(200).json()
})

server.post('/api/password/reset', (req, res) => {
  const {email, password, password_confirmation, token} = req.body
  if (email === 'fail@test.com') {
    res.status(422).json({ code: 'general.not_found', message: 'Email not found' })
    return
  }
  if (!token || !password || !password_confirmation) {
    res.status(422).json({ code: 'general.validation_failed', message: 'Some fields are empty' })
    return
  }
  if (password !== password_confirmation) {
    res.status(422).json({
      code: 'general.validation_failed',
      message: 'Passwords not match.',
      errors: {
        offer_type: ["The password field is not equal password confirmation field."]
      }
    })
    return
  }

  res.status(200).json()
})

// simulate `api/me` endpoint
server.get('/api/me', (req, res) => {
  const authUser = jwt.verify(
    req.cookies && req.cookies.access_token ? req.cookies.access_token : '',
    SECRET_KEY,
    (err, decode) => decode !== undefined ? decode : null
  )
  const dbUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users
  // get data from token-found-user or first from mock-api
  const data = authUser ? dbUsers.find(dbUser => dbUser.email === authUser.username) : dbUsers[0];
  res.status(200).json({ data })
  // user not found error
  // try { } catch(error) {
  //   res.status(401).json({ code: 'general.no_action_permision', message: 'Unauthenticated.', })
  // }
})
// simulate QR code generator
server.get('/api/google2fa/generate', (req, res) => {
  const qr_code = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAACa5JREFUeNrt3YFq4koUgGFfQt//4cSHEMGlBSF002SsyeScOd8P4W6XYFcdv5rD1Ht6SlKSTh4CScCSJGBJApYkAUuSgCUJWJIELEkCliRgSRKwJAlYkoAlScCSJGBJApYkAUuSgCUJWJIELEkCliRgSRKwJAlYkoAlScCSJGBJApYkAUsSsCQJWJIELEnAkiRgSRKwJAFLkoDV2vl8fp5Op5JH05O20e2EW4zBHmfrEFgWCrCABayxwLpcLhYKsA5/nK1DYFkowAIWsFwSAgtYLgmBBSxgAcs6BJa34sBySQgsYAELWMAClktCYLkktA6B9ceFcr1en/f7/fv8r/++jp9fRzqn5X5FA6vyi8Q6BNbmC2XtiTr6AFYNsCquQ2C9MTu43W7pLnla7hewrMMs6xBYbzygXz/Zlpr+ZHnnnLmvtzrHO6zxwKq8DoH1x9nBzydr7u1wyzlmWMCyDoHVddj57vX81gtl6QBWnaF7hXUILLMDYFmHZljAam9t3vDJOcAC1kjrEFgfzg5aBpC/zRL2PMclYa0ZVpV1CKwNZgfTr3u+2KIN3aOhFg1Q6xBYh4C1NJA8YqFEGboDqy9YFdchsDaeHWT8ZVpgxbnv1iGwNntAWzbs9f7JtjTs9A5rTLAqr0NgfTjsNMMC1pEzrGrrEFgbDDunhxkWsI4auldYh8AyOwCWGZYZFrD6L5SjN44CC1h7r0NgfTg7iDbsNMOqOcOqsg6BtcHswNA95kc2Z/x4aOsQWJsvFBtHgRUBLBtHzbAMO4F1KFjWIbB2Wyhzw0VDd2BZh4buZlgrs4MsQ3dgWYfAKr5QzLCAZYblktDsAFhmWGZYwDLDApZ1CKyub8XnnhgbR4FlHZphmWEl2bCXEZFoEFuHwNp8odiwByyfOGroboaVfNgJLL/8bOgeGCwb9oAVASzr0CWhDXvAMsOycRRYZljAsg6BZYZlhmWGZR0Cy4Y9YAHLDCv9JeHcE1N9wx6wfOKoGVayGVbLJrqe54y6033UrENgbb5Q1p6oSAewxgWr4joE1sazg4z3C1jWYZZ1CKwPFsrccLFlADl3ztp5recAqx5YldYhsAaZHew97ASWdRhhHQJrg4Vy9GHoDqwq6xBYZgfAsg7NsIAFLGBZh8AK8Fb88Xh8H6+3u9M/T//uiHNef3597ZJw3EvCiusQWG8slFGPrcByO312uldeh8CyUEADLGCNOMMCltvZ+3asQ2BZKIAAFrBcEgLL7bgkBBawgAUs6xBY3ooDwiUhsIAFLLcDLGC5JASWS0LrEFg67skPtrjtvBewBCwBS8ACloAlYAFLwBKwBCwBC1gCloAFLAFLwBKwBCxgqSBYGV9IGXcYR9tZnhG1no+hne7AAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgFdylnXHBZcQx4w/g0X9bAFjAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCAVRSsjAsl467oUddGZdSABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAGvIJHvZJK7zLP9q/J+NHdQMLWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFow7/nowfg1v5uRj1txcyowYsYHkugAUsLxJgAQtYwAIWsIAFLGABy3MBLGB5kQALWMACFrCABSxgAQtYngtgAcuLBFjAAlZRsEZFJOPC9aL1AwZYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCA5b4DC1jAAhawgAUsYAELWMAClhet+w4sYOV4ABIuJru9c2FkhzqwgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCABSxgAQtYicDK+DHBlV8k0R6faKADC1jAAhawgAUsYAELWMACFrCABSxgAQtYwAIWsIAFLGABC1jAAhawgAUsYAELWMACFrCAVRYRH5Ub53uN+lHLdroDC1jAAhawgAURYAELWMDyvYAFLGABC1jAAhawIAIsYAELWL4XsIAFLGABC1jAAhawgAUsYCkF6BnvV8bfTBCwgAUsYAFLwAIWsIAlYAFLwAIWsIAFLAELWMACloAFLAELWMACFrAELGABqyxY5/PZTmXIptgxDyxgAQtYwFIesC6XC7CABSwBC1jAAhawXBICC1jAAhawgAUsuSQEFrCABSxgAQtYwHJJCCxgAQtYWcG6Xq/P+/3+ff7Xf1/Hz68jndNyvzK+AADRB2s/OAcAaw2Mow9gAQtYZljP2+2W7u1sy/0CFrCANSBYX++wlpq+w3nnnLmvtzrHOyxgAcsM6z805i7LWs4xwwIWsIDVdej+7lxpa7CWDmABC1hmWGZYwAIWsGqCtTb3+uQcYAELWC4J3xqE/zbT2vMcl4TAAhawVudKPZ/gjEP3aLvPo32vygewdgJraTB+BFiZhu7AcgAr0Awr2hMcbYYFLAewOoHVsnG09zuspaG7d1jAApZLwsUhtxkWsBzACj10nx5mWMByAMsMywwLWMAC1khgZdg4CiwHsA6cYUUbupthAQtYwCq/cbQnagCN8+IHlo2jKYfuwAIWsMyw0gzdgQUsYCUHa27IPerQHVjAApYZ1mYzrL2H7sACFrCAZYYFLGABywzLJSGwgAWs0E+wGRawgOWS0MZRYAELWGZYo20cjfYCyLiTe1T0M2fj6KBDd2ABC1hmWGmG7sACFrACg2XjKLCABSwzrKQbR4EFLGABywwLWMAClhkWsIAFLGCZYQELWMCKdUk4B0T1jaPAAhawks2wWjZz9jyn50ckR3sBVL4dH38MrKaNo9EOYAELWGZYaer5f80BDbCAFRisuSF3yyB87py181rPAZbbAZZLwvAzrL2H7sACFrAGAevow9Dd7QDLJaEZFrCABSxgAQs0wAJWt0vCx+Pxfbwuu6Z/nv7dEee8/vz62iUhsIBVFCw7sMfbMR/tvo/6OPuIZGABC1jAMsMCFrCABSxgAQtYwAKWS0JgAQtYwAIWsIAFLJeEwAIWsIAFLGABC1guCYEFLGABS5LCByxJwJIkYEkCliQBS5KAJQlYkgQsSQKWJGBJErAkCViSgCVJwJIkYEkCliQBS5KAJQlYkgQsSQKWJGBJErAkCViSgCVJwJIkYEkCliQBSxKwPASSgCVJwJIELEkCliQBSxKwJAlYkvRR/wDHEBf5bpsC9QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yNlQwNjowNzoyNCswMDowMNWjXGAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjZUMDY6MDc6MjQrMDA6MDCk/uTcAAAAKHRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy90bXAvbWFnaWNrLWNmcmlOOVE0n/oJTwAAAABJRU5ErkJggg=='
  const secret = 'iVBORw0KGgoAAAANSUhEUgAAASwAAAEs'
  res.status(200).json({ data: { qr_code, secret } })
  // res.status(422).json()
})
// simulate 2fa code verification
server.post('/api/google2fa/verify', (req, res) => {
  const {one_time_password} = req.body
  if (one_time_password != '123456') {
    res.status(417).json({
      code: 'general.no_action_permission',
      message: 'The \'One Time Password\' typed was wrong.'
    })
    return
  }
  res.status(204).json();
})
// simulate "need to 2FA" server response
server.get('/api/google2fa/test', (req, res) => {
  res.status(417).json()
})

// Create group
server.post('/api/groups', (req, res) => {
  const file = require(path.join(__dirname, 'data.json'))
  const dbGroups = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).groups
  const id = dbGroups.length + 1
  const group = {
    id,
    name: `Test Group ${id}`,
    description: `Test Group ${id} description`,
    logo: 'https://placeimg.com/64/64/any',
    background: 'https://placeimg.com/64/64/animals',
    owner: true,
    members: [{
      "user_id": 1,
      "name": "Mock User",
      "email": "user@user.com",
      "member_from": new Date().toISOString(),
      "owner": true,
      "profile": {
        "avatar": "https://placeimg.com/64/64/people"
      }
    }]
  }
  dbGroups.push(group)
  file.groups = dbGroups
  updateDbState(file)

  res.status(200).json({ data: group })
})
// Update group
server.put('/api/groups/:id', (req, res) => {
  const {name, description } = req.body
  const file = require(path.join(__dirname, 'data.json'))
  const dbGroups = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).groups
  let updated = null;
  dbGroups.map(group => {
    if (group.id == req.params.id) {
      group.name = name
      group.description = description
      updated = group
    }
  })
  file.groups = dbGroups
  updateDbState(file)

  if (updated) {
    res.status(200).json({ data: updated })
  } else {
    res.status(401).json({message: 'Group not found or can\'t edit', code: 'general.no_action_permision'})
  }
})
server.post('/api/groups/:id/change-logo', (req, res) => {
  res.status(200).json()
})
server.post('/api/groups/:id/change-background', (req, res) => {
  res.status(200).json()
})
// Leave group
server.post('/api/groups/:id/leave', (req, res) => {
  const file = require(path.join(__dirname, 'data.json'))
  const dbGroups = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).groups
  file.groups = dbGroups.filter(group => group.id != req.params.id)
  updateDbState(file)
  res.status(204).json()
})
// Remove member from group
server.post('/api/groups/:id/remove', (req, res) => {
  const file = require(path.join(__dirname, 'data.json'))
  const dbGroups = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).groups
  file.groups = dbGroups.map(group => {
    if (group.id == req.params.id) {
      group.members = group.members.filter((member) => member.user_id != req.body.user_id)
    }
    return group;
  })
  updateDbState(file)
  res.status(204).json()
})
// Remove member from group
server.post('/api/groups/:id/invite', (req, res) => {
  res.status(204).json()
})

// Update user profile data
server.put('/api/users/:id', (req, res) => {
  const dbUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users
  const data = dbUsers.find(dbUser => dbUser.id == req.params.id)
  res.status(201).json({ data })
})
// Upload user's profile avatar
server.post('/api/users/:id/avatar', (req, res) => {
  const dbUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users
  const data = dbUsers.find(dbUser => dbUser.id == req.params.id)
  res.status(201).json({ data })
})
// Delete user's profile avatar
server.delete('/api/users/:id/avatar', (req, res) => {
  const dbUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))).users
  const data = dbUsers.find(dbUser => dbUser.id == req.params.id)
  res.status(201).json({ data })
})


// Change password imitation
server.post('/api/users/change-password', (req, res) => {
  res.status(204).json()
})
// Enable 2FA imitation
server.post('/api/users/enable-2fa', (req, res) => {
  const {one_time_password} = req.body
  if (one_time_password != '123456') {
    res.status(422).json({
      code: 'general.no_action_permission',
      message: 'The \'One Time Password\' typed was wrong.'
    })
    return
  }
  res.status(204).json();
})
// Disable 2FA imitation
server.post('/api/users/disable-2fa', (req, res) => {
  const {one_time_password} = req.body
  if (one_time_password != '123456') {
    res.status(422).json({
      code: 'general.no_action_permission',
      message: 'The \'One Time Password\' typed was wrong.'
    })
    return
  }
  res.status(204).json();
})
// Enable Interface Settings imitation
server.put('/api/users/:id/settings', (req, res) => {
  const { interface_lang, theme } = req.body
  const user = router.db.get('users').find({ id: +req.params.id }).value()
  if (user && user.settings) {
    user.settings.interface_lang = interface_lang
    user.settings.theme = theme
  }
  router.db.get('users').find({ id: +req.params.id }).assign(user).write()
  res.status(204).json()
})
// Accept Security Risks imitation
server.post('/api/users/security-risks', (req, res) => {
  res.status(204).json()
});
// Accept Security Risks imitation
server.post('/api/notifications/read', (req, res) => {
  res.status(204).json()
});
// Change notification setting imitation
server.put('/api/users/:id/notifications', (req, res) => {
  res.status(200).json({ data: req.body })
});


// auth middleware
server.use(/^(?!\/auth|\/markets).*$/, (req, res, next) => {
  // temporary disable auth (public endpoints presents)
  next()
  return

  if (!req.cookies || !req.cookies.access_token) {
    res.status(401).json({message: 'Bad authorization cookie', code: 'general.no_action_permision'})
    return
  }
  try {
     verifyToken(req.cookies.access_token)
     next()
  } catch (err) {
    res.status(401).json({message: 'Error: token is not valid', code: 'general.no_action_permision'})
  }
})

// add "meta" data to every response
router.render = function (req, res) {
  res.jsonp({
    data: res.locals.data,
    meta: {
      // commented for ranking API pagination model synced
      // pagination: {
        current_page: 1,
        from: 1,
        last_page: 58,
        path: 'some text',
        to: 2,
        per_page: 1,
        total: 58
      // }
    },
    exec_time: 0.123
  })
}

//define custom routes
server.use(jsonServer.rewriter({
  "/api/*": "/$1",
  "/users/:id/notifications": "/users_notifications",
}));

// run server
server.use(router)
server.listen(3000, () => {
  console.log('API Server is listening on: 3000')
})
