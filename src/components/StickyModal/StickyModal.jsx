import React ,{useState,useEffect} from 'react'
import './stickyModal.scss'

   const StickyModal = ({open,initialData,onSubmit,onClose}) => {
   const[title,setTitle]=useState('')
   const [content,setContent]=useState ('')
   const [color,setColor]=useState('#ffe23b');

   useEffect(()=>{
    if(initialData){
        setTitle(initialData.title ||"");
        setContent(initialData.content || '');
        setColor(initialData.color || '#ffeb3b')
    }
    else{
      setTitle('')
      setContent('')
      setColor('#ffeb3b')
    }
   },[initialData,open]);

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!title.trim() || !content.trim()) return ;
       onSubmit({title:title.trim() ,content:content.trim(),color:color})
  }
  if(!open) return null;

  return (
    <div>
      <div className="modalOverlay" onClick={(e) => e.stopPropagation()}>
        <div className="modalContent">
            <h2>{initialData?'Edit Sticky Note':'Add Sticky Notes'}</h2>
            <form  onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" 
                id="title" value={title} 
                placeHolder='e.g. Meeting Notes' 
                onChange={(e)=> setTitle(e.target.value)}
                maxLength={50}
                required />
                <label htmlFor="content">Content</label>
                <textarea 
                name="content" 
                value={content} 
                onChange={(e)=> setContent(e.target.value)}
                placeholder='e.g. Discuss project ideas' 
                rows={5}></textarea>
                <label htmlFor="color">Color</label>
                <input 
                type="color" 
                id='color' 
                value={color}
                onChange={(e) => setColor(e.target.value)} 
                />

                <div className="modal-button"></div>
                <button type='submit' >{initialData?'Save':'Add'}</button>
                <button type="button" className="cancelBtn" onClick={onClose}>
                    {' '}
                    Cancel
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default StickyModal
