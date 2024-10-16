import QuillEditor from "@/components/quill-editor.tsx";
import {useRef} from "react";
import { Delta } from "quill/core";

function Edtitor() {
    const quillRef = useRef(null);
    const onTextChange = (delta: Delta) => {
        console.log(delta.ops);
    }
    return (
        <div className="p-6 h-full">
            <QuillEditor
                className="h-full text-2xl"
                ref={quillRef}
                readOnly={false}
                onTextChange={onTextChange}
            />
        </div>
    )
}

export default Edtitor;