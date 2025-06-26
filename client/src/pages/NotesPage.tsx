import { Route, Routes } from 'react-router-dom';
import AsideNotes from '../components/AsideNotes';

export default function NotesPage() {
  return (
    <div>
      <AsideNotes />
      <Routes>
        <Route path="/" element={<div>All Notes</div>} />
        <Route path="/tags" element={<div>Tags</div>} />
        <Route path="/trash" element={<div>Lixeira</div>} />
      </Routes>
      <main></main>
    </div>
  );
}
