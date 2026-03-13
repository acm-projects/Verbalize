'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateAssignment() {
  const [name, setName] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const extractText = async (file: File) => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => 'str' in item ? item.str : '');
      text += strings.join(' ') + '\n';
    }
    return text;
  }

  const handleCreate = async () => {
    if (!name || !pdfFile || !zipFile) return alert("Please fill everything out!");

    try {
      const aiText = await extractText(pdfFile);

      const zipPath = `master_zip/${Date.now()}-${zipFile.name}`;
      await supabase.storage.from("AssignmentsBucket").upload(zipPath, zipFile);

      const { data: assignment, error } = await supabase
        .from('Assignments')
        .insert({
          assignment_name: name,
          instruction_text: aiText,
          submissons: zipPath
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/assignments/${assignment.id}/upload`);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Create Assignment</h1>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} style={{ color: 'black', display: 'block', marginBottom: '10px' }} />
      <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
      <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files?.[0] || null)} />
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}