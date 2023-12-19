export default function Tag(res){
    return <>
    <div className="tag_container">
        {res?.meme?.template?.tag?.map((tag)=>(
            <div>#{tag?.name}</div>
        ))}
    </div>
    </>
}