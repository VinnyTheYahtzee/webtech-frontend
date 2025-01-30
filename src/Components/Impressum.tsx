import './css/Datenschutz.css';

const Impressum: React.FC = () => {
  return (
    <div className="datenschutz-container">
      <h1>Datenschutzerklärung</h1>
      <section>
        <h2>Allgemeine Hinweise</h2>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert,
          wenn du unsere Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich
          identifiziert werden kannst.
        </p>
      </section>
      <section>
        <h2>Datenverarbeitung auf unserer Website</h2>
        <h3>Verantwortlicher</h3>
        <p>
          Verantwortliche für die Datenverarbeitung auf dieser Website ist:
          <br />
          Noch kein Unternehmen
          <br />
          Joshua Christian Schneider
          <br />
          Treskowallee 8,
            10318  Berlin
          <br />
          sagsjosh@gmail.com
        </p>
        <h3>Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck der Verwendung</h3>
        <p>
          Wenn du unsere Website besuchst, erheben wir bei jedem Zugriff auf die Website automatisch eine Reihe von
          allgemeinen Daten und Informationen.
        </p>
      </section>
      <section>
        <h2>Weitergabe von Daten</h2>
        <p>
          Eine Übermittlung deiner persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken
          findet nicht statt.
        </p>
      </section>
      <section>
        <h2>Betroffenenrechte</h2>
        <ul>
          <li>Gemäß Art. 15 DSGVO Auskunft über deine von uns verarbeiteten personenbezogenen Daten zu verlangen.</li>
          <li>
            Gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung deiner bei uns
            gespeicherten personenbezogenen Daten zu verlangen.
          </li>
          <li>Gemäß Art. 17 DSGVO die Löschung deiner bei uns gespeicherten personenbezogenen Daten zu verlangen.</li>
          <li>
            Gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung deiner personenbezogenen Daten zu verlangen.
          </li>
          <li>
            Gemäß Art. 20 DSGVO deine personenbezogenen Daten, die du uns bereitgestellt hast, in einem strukturierten,
            gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu
            verlangen.
          </li>
        </ul>
      </section>
      <section>
        <h2>Aktualität und Änderung dieser Datenschutzerklärung</h2>
        <p>
          Diese Datenschutzerklärung ist aktuell gültig und hat den Stand November, 2024. Durch die
          Weiterentwicklung unserer Website und Angebote darüber oder aufgrund geänderter gesetzlicher beziehungsweise
          behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
        </p>
      </section>
    </div>
  );
};

export default Impressum;