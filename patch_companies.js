const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
}

const apiDir = path.join(process.cwd(), 'apps', 'web', 'app', 'api');
const files = getFiles(apiDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    // Solo si tiene el import original o si necesita el cambio
    if (content.includes('company: true') || content.includes('user.company')) {
        // 1. Reemplazo del include query de prisma
        newContent = newContent.replace(/include:\s*{\s*company:\s*true\s*}/g, 'include: { companies: { include: { company: true } } }');

        // 2. Reemplazo de sintaxis de validación y acceso
        newContent = newContent.replace(/!user\.company/g, '!user.companies?.[0]?.company');

        // 3. Cuando le piden el id
        newContent = newContent.replace(/user\.company\.id/g, 'user.companies[0].company.id');

        // 4. Cualquier otra ocurrencia de user.company que quede -> user.companies?.[0]?.company
        newContent = newContent.replace(/user\.company/g, 'user.companies?.[0]?.company');

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated', file);
            count++;
        }
    }
}

console.log('Total updated:', count);
