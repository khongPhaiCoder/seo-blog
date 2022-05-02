const convert = (currentTree, paths, item) => {
    if (paths.length === 0) {
        const children = currentTree.children ? currentTree.children : [];
        return {
            ...currentTree,
            children: [...children, item],
        };
    }

    if (currentTree._id === paths[0]) {
        return convert(currentTree, paths.slice(1), item);
    }

    const child = currentTree.children.find((i) => i._id === paths[0]);

    if (child) {
        return {
            ...currentTree,
            children: [
                ...currentTree.children.filter((i) => i._id !== child._id),
                convert(child, paths.slice(1), item),
            ],
        };
    }

    const newTree = { ...item };
    const children = currentTree.children ? currentTree.children : [];

    return {
        ...currentTree,
        children: [...children, newTree],
    };
};

const convertToTreeView = (treeInfo, root) => {
    let tree = {
        _id: root,
        children: [],
    };

    treeInfo
        .map((item) => {
            return { ...item, _id: item._id.toString() };
        })
        .forEach((item) => {
            const paths = item.path.split(",");
            tree = convert(tree, paths, item);
        });

    return tree.children;
};

module.exports = convertToTreeView;
