import { useEffect, useState } from 'react';
import { shuffle } from './utils';
import data from './data.json';
import './App.css';

const searchParams = new URLSearchParams(document.location.search)
const limit = searchParams.get('limit');
const invert = searchParams.get('invert');
const shuffledData = shuffle(data.list).slice(0, limit ?? data.list.length);
const source = invert ? "answer" : "question";
const target = invert ? "question" : "answer";

function App() {
  const [resolvedIds, setResolvedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [doubtIds, setDoubtIds] = useState([]);
  const [currentQuestionId, setQuestionId] = useState(0);
  const [anwserHidden, setAnswerHidden] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestionId(c => c + 1);
    setAnswerHidden(true);
  }, [resolvedIds, rejectedIds, doubtIds]);

  useEffect(() => {
    (currentQuestionId === shuffledData.length) && setDone(true);
  }, [currentQuestionId]);

  useEffect(() => setQuestionId(0), []);

  const resolve = id => {
    setResolvedIds(resolvedIds.concat(id));
  }
  const reject = id => {
    setRejectedIds(rejectedIds.concat(id));
  }
  const doubt = id => {
    setDoubtIds(doubtIds.concat(id));
  }

  return (
    <div className="App">
      <main className="container-main">
        {!done && currentQuestionId < shuffledData.length && (<header>{currentQuestionId} / {shuffledData.length}</header>)}
        {!done && currentQuestionId < shuffledData.length && (<><span className="item--question" onClick={() => setAnswerHidden(false)}>{shuffledData[currentQuestionId][source]}</span>
          <span className={`item--answer ${anwserHidden ? "hidden" : "expanded"} `}>{shuffledData[currentQuestionId][target]}</span>
          <div className="container-respuestas">
            <button className="boton-respuesta" onClick={() => resolve(currentQuestionId)}>✅</button>
            <button className="boton-respuesta" onClick={() => doubt(currentQuestionId)}>🚩</button>
            <button className="boton-respuesta" onClick={() => reject(currentQuestionId)}>❌</button>
          </div>
        </>)}
        {done && (<>
          <div className="container-listo">
            <span className="item--results">✅ Correctas : <strong>{resolvedIds.length}</strong></span>
            <span className="item--results">🚩 Dudosas : <strong>{doubtIds.length}</strong></span>
            <span className="item--results">❌ Incorrectas : <strong>{rejectedIds.length}</strong></span>
            <span className="item--results">Total: <strong>{shuffledData.length}</strong></span>
          </div>
        </>)}
      </main>
    </div>
  );
}

export default App;
