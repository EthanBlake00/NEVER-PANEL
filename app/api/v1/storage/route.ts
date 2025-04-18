import {authorizeRequest, deleteFiles, uploadFile} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const formData = await req.formData()

        const res = await uploadFile(formData.get('file') as File, <string>formData.get("path"));
        if (!res) {
            return NextResponse.json({message: 'Error uploading file'}, {status: 500});
        }
        return NextResponse.json(res);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching orders', error: error.message}, {status: 500});
    }
};

export const DELETE = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const url = new URL(req.url);
        // Get the path from the query
        const path = url.searchParams.get('path');

        if (!path) {
            return NextResponse.json({message: 'Path not provided'}, {status: 400});
        }

        await deleteFiles(path);

        return NextResponse.json({message: 'Files deleted successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: error.message}, {status: 500});
    }
};
export const dynamic = "force-dynamic";
