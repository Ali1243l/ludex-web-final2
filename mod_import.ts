import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('import { motion, AnimatePresence } from "motion/react";')) {
    content = content.replace(
        "import React, { useState, useMemo, useEffect } from 'react';",
        "import React, { useState, useMemo, useEffect } from 'react';\nimport { motion, AnimatePresence } from \"motion/react\";"
    );
    fs.writeFileSync('src/App.tsx', content, 'utf-8');
    console.log('Import added!');
} else {
    console.log('Already imported!');
}
