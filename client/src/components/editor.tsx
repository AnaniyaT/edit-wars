import QuillEditor from "@/components/quill-editor.tsx";
import Session from "@/lib/adapters/session.ts";
import useEditor from "@/hooks/use-editor.ts";

interface EditorProps {
    session?: Session,
    readonly?: boolean
}

function Edtitor({ session, readonly }: EditorProps) {
    const { quillRef, onTextChange, onSelectionChange } = useEditor(session);

    return (
        <div className="h-full">
            <QuillEditor
                className="h-full text-2xl"
                ref={quillRef}
                readOnly={readonly != undefined ? readonly : false}
                onTextChange={onTextChange}
                onSelectionChange={onSelectionChange}
            />
        </div>
    )
}

export default Edtitor;