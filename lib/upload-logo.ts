export async function uploadLogoAndAttach(
    formData: FormData,
    supabase: any,
    bucket = "logos",
) {
    const file = formData.get("logo") as File | null;

    if (!file || file.size === 0) return;

    const fileExt = file.name.split(".").pop();

    const cleanName = ((formData.get("name") as string) || "company")
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();

    const fileName = `${cleanName}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    formData.append("logo_url", data.publicUrl);
}
