"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailing_service_1 = __importDefault(require("../mailing/mailing.service"));
const suggest_service_1 = __importDefault(require("./suggest.service"));
const sdk_1 = require("@directus/sdk");
const msg1 = `
<html>
  <style>
    header > h1 {
      font-size: 16px;
    }
  
    body {
      font-size: 14px;
    }
  
    main > p {
      display: grid;
    }
    a {
      text-decoration : none
    }
  </style>
  <body>
  <header>
    <h1>Bonjour 👋, Je suis Achille de <a href="chillo.tech" _target="blank">chillo.tech</a></h1>
    <p>Nous venons de recevoir votre suggestion de contenu: je vous en remercie.</p>
  </header>
  <p>Nous allons l'analyser et l'intégrer rapidement dans la liste des tutoriels à réaliser.</p>
  <p>Pour toute question ou suggestion n'hésitez pas à nous contacter.</p>

  <main>
    <div>
      <p>Bien à vous,</p>
      <p>Achille MBOUGUENG,</p>
      <p>Fondateur de <a href="chillo.tech" _target="blank">chillo.tech</a></p>
      <a href="tel:+33761705745" >+33 7 6170 57 45</a>
      <a href="https://www.youtube.com/channel/UC1fetPjPtTcUZWfiQpebf0Q>youtube</a>
      <a href="https://www.linkedin.com/company/86905161/admin/feed/posts/>LinkedIn</a> 
      <a href="https://www.facebook.com/profile.php?id=100084306755977" >facebook</a>
    </div>
  </main>
  </body>
</html>
`;
const msg2 = (name, title) => `
<html>
<style>
    header > h1 {
      font-size: 16px;
    }
  
    body {
      font-size: 14px;
    }
  
    main > p {
      display: grid;
    }
    a {
      text-decoration : none
    }
  </style>
  <body>
  <header>
    <h1>Bonjour 👋, ${name} vient de suggerer un contenu</h1>
  </header>
  <p>Titre ${title}</p>

  <main>
    <div>
      <p>Merci,</p>
      <a href="https://www.youtube.com/channel/UC1fetPjPtTcUZWfiQpebf0Q>youtube</a>
      <a href="https://www.linkedin.com/company/86905161/admin/feed/posts/>LinkedIn</a> 
      <a href="https://www.facebook.com/profile.php?id=100084306755977" >facebook</a>
    </div>
  </main>
  <body>
    
  </body>
</html>
`;
const makeSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { author, description, title } = req.body;
    // console.log('re', re)
    try {
        // store suggestion
        const suggest = yield suggest_service_1.default.create({
            author,
            description,
            title,
        });
        console.log('suggest', suggest);
        // make external API calls
        const tempObj = {
            name: (_a = suggest.author) === null || _a === void 0 ? void 0 : _a.name,
            email: (_b = suggest.author) === null || _b === void 0 ? void 0 : _b.email,
            tags: (_c = suggest.author) === null || _c === void 0 ? void 0 : _c.tag.join(', '),
            phoneindex: (_e = (_d = suggest.author) === null || _d === void 0 ? void 0 : _d.phoneIndex) === null || _e === void 0 ? void 0 : _e.toString(),
            phone: (_g = (_f = suggest.author) === null || _f === void 0 ? void 0 : _f.phone) === null || _g === void 0 ? void 0 : _g.toString(),
            civility: (_h = suggest.author) === null || _h === void 0 ? void 0 : _h.civility,
            title: suggest.title,
            description: suggest.description,
        };
        const client = (0, sdk_1.createDirectus)('https://contacts.chillo.fr')
            .with((0, sdk_1.rest)())
            .with((0, sdk_1.staticToken)(process.env.DIRECTUS_API_KEY || ''));
        // console.log('client', client.url.toString());
        client
            .request((0, sdk_1.createItem)('contact', tempObj))
            .then(res => {
            console.log('res', res);
        })
            .catch(err => {
            console.log('err', err.errors[0].extensions);
        });
        // send mail to confirm recption
        // first configure mailingOptions Obj
        const mailOptions = {
            to: author.email,
            subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
            text: msg1,
        };
        // the send the mail
        console.log('mailingOptions', mailOptions);
        mailing_service_1.default.send(mailOptions);
        const mailingOptions2 = {
            to: 'acceuil@chillo.tech',
            subject: 'Nouvelle suggestion de contenu!',
            text: msg2((_j = suggest.author) === null || _j === void 0 ? void 0 : _j.name, suggest.title),
        };
        mailing_service_1.default.send(mailingOptions2);
        res.json(suggest);
    }
    catch (e) {
        console.log('e', e);
        res.json({ msg: 'something went wrong' });
    }
});
const suggestController = {
    makeSuggestion,
};
exports.default = suggestController;
