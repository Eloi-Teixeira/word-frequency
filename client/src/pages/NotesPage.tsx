import { Route, Routes } from 'react-router-dom';
import AsideNotes from '../components/notes/AsideNotes';
import MainNotes from '../components/notes/MainNotes';

export default function NotesPage() {
  return (
    <div className='notes-page'>
      <AsideNotes />
      <Routes>
        <Route path="/" element={<MainNotes />} />
        <Route path="/tags" element={<div>Tags</div>} />
        <Route path="/trash" element={<div>Lixeira</div>} />
      </Routes>
      <main></main>
    </div>
  );
}
