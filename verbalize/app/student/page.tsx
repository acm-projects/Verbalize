// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import Papa from 'papaparse'

// export default function StudentPage() {
//   const [file, setFile] = useState<File | null>(null)
//   const supabase = createClient()

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first')
//       return
//     }
//     const uniqueName = `${Date.now()}-${file.name}`;
//     try{
//       const {data, error: storageError} = await supabase.storage
//       .from("StudentBucket")
//       .upload('uploads/' + uniqueName,file)
      
//       if (storageError) throw storageError
      
//       if(file){
//       Papa.parse(file,{
//       header:false,
//       skipEmptyLines:true,
//       complete: async (results) => {
        
//         const rows = results.data.slice(1);

//         const studentsToInsert = rows.map((row: any) => ({
//           first_name: row[0],
//           last_name: row[1],
//           netID: row[2],
//           email: row[3],
//           course_section: row[4]

//         }))

//         const {error : dataError} = await supabase
//           .from('Students')
//           .insert(studentsToInsert)
        
//         if (dataError) {
//               alert("File stored, but database error: " + dataError.message)
//             } else {
//               alert(`Success! File uploaded and students added to the database.`)
//             }
        
//       }
//     })
//     }
    

      

//     //alert(`Upload successful! File path: ${data?.path}`)
//   } 
//   catch (error: any) {
//     alert('Upload failed: ' + error.message)
//   }
//     }

    
//     return (
//     <div style={{ padding: '40px' }}>
//       <h1>Student Page</h1>

//       <div style={{ marginTop: '20px' }}>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={(e) => {
//             if (e.target.files) {
//               setFile(e.target.files[0])
//             }
//           }}
//         />
//       </div>

//       <div style={{ marginTop: '20px' }}>
//         <button onClick={handleUpload}>
//           Upload File
//         </button>
//       </div>
//     </div>
//   )
// }