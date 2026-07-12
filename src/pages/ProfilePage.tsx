import { useParams } from "react-router-dom";
export default function ProfilePage() { 
    const { id: urlId } = useParams();
    
    return (
        <div>
            <h1>Profile Page</h1>
            <p>User ID: {urlId}</p>
        </div>
    );
}