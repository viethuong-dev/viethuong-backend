export function build_search_object_in_translation(
    keyword: string,
    search_keys: string[],
) {
    // { $regex: keyword, $options: 'i' }
    const regex = new RegExp(keyword, 'i');
    const or_options = [];
    for (const search_key of search_keys) {
        or_options.push({ [`translation.en.${search_key}`]: regex });
        or_options.push({ [`translation.vi.${search_key}`]: regex });
    }

    return { $or: or_options };
}
