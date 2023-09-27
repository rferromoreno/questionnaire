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
      <main className="flex flex-col justify-center items-center min-h-screen space-y-8">
        {!done && currentQuestionId < shuffledData.length && (<header>{currentQuestionId} / {shuffledData.length}</header>)}
        {!done && currentQuestionId < shuffledData.length && (<><span className="item--question font-medium text-4xl md:text-7xl" onClick={() => setAnswerHidden(false)}>{shuffledData[currentQuestionId][source]}</span>
          <span className={`item--answer ${anwserHidden ? "hidden" : "expanded"} italic text-xl md:text-3xl`}>{shuffledData[currentQuestionId][target]}</span>
          <div className="grid grid-cols-3 gap-6 md:gap-32">
            <button type="button" disabled={anwserHidden} className={`p-6 text-3xl md:text-6xl rounded-lg border-4 ${anwserHidden ? "bg-gray-100 border-gray-500" : "bg-lime-100 border-lime-600"}`} onClick={() => resolve(currentQuestionId)} >✅</button>
            <button type="button" disabled={anwserHidden} className={`p-6 text-3xl md:text-6xl rounded-lg border-4 ${anwserHidden ? "bg-gray-100 border-gray-500" : "bg-yellow-100 border-yellow-500" }`} onClick={() => doubt(currentQuestionId)}>🚩</button>
            <button type="button" disabled={anwserHidden} className={`p-6 text-3xl md:text-6xl rounded-lg border-4 ${anwserHidden ? "bg-gray-100 border-gray-500" : "bg-rose-100 border-rose-500"}`} onClick={() => reject(currentQuestionId)}>❌</button>
          </div>
        </>)}
        {done && (<>
          <div className="flex flex-col justify-center items-center min-h-screen text-3xl md:text-5xl space-y-2">
            <span>✅ Correctas : <strong>{resolvedIds.length}</strong></span>
            <span>🚩 Dudosas : <strong>{doubtIds.length}</strong></span>
            <span>❌ Incorrectas : <strong>{rejectedIds.length}</strong></span>
            <span>Total: <strong>{shuffledData.length}</strong></span>
          </div>
        </>)}
      </main>
    </div>
  );
}

export default App;
