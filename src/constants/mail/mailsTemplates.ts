export const msg1 = `
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
      <a href="tel:+33761705745" >+33 7 6170 57 45</a><br/>
      <a href="https://www.youtube.com/channel/UC1fetPjPtTcUZWfiQpebf0Q>youtube</a><br/>
      <a href="https://www.linkedin.com/company/86905161/admin/feed/posts/>LinkedIn</a><br/>
      <a href="https://www.facebook.com/profile.php?id=100084306755977" >facebook</a>
    </div>
  </main>
  </body>
</html>
`;

export const msg2 = (name?: string | null, title?: string | null) => `
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
      <a href="https://www.youtube.com/channel/UC1fetPjPtTcUZWfiQpebf0Q>youtube</a><br/>
      <a href="https://www.linkedin.com/company/86905161/admin/feed/posts/>LinkedIn</a><br/>
      <a href="https://www.facebook.com/profile.php?id=100084306755977" >facebook</a>
    </div>
  </main>
  <body>
    
  </body>
</html>
`;
