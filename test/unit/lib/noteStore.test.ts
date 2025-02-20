import path from 'path'
import { expect } from 'chai'

import TestDirectory from '../../util/notesDirectory'
import Note from '../../util/note'
import NoteStore from '../../../src/lib/noteStore'

suite('NoteStore', () => {
    const notesDir = new TestDirectory('test-notes')
    let store = new NoteStore(notesDir.path())

    teardown(() => notesDir.empty())

    suiteTeardown(() => notesDir.remove())

    test('Finds a note', () => {
        notesDir.createFile('note.md')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf('note.md'),
                    fileRelativePath: 'note.md',
                    fileName: 'note.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note.md'),
                    tags: [],
                    title: undefined,
                },
            ])
        })
    })

    test('Finds multiple notes', () => {
        notesDir.createFile('note1.md')
        notesDir.createFile('note2.md')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf('note1.md'),
                    fileRelativePath: 'note1.md',
                    fileName: 'note1.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note1.md'),
                    tags: [],
                    title: undefined,
                },
                {
                    filePath: notesDir.pathOf('note2.md'),
                    fileRelativePath: 'note2.md',
                    fileName: 'note2.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note2.md'),
                    tags: [],
                    title: undefined,
                },
            ])
        })
    })

    test('Finds a note in a subdirectory', () => {
        notesDir.createFileInDirectory('subdir', 'note.md')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf(path.join('subdir', 'note.md')),
                    fileRelativePath: path.join('subdir', 'note.md'),
                    fileName: 'note.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('subdir/note.md'),
                    tags: [],
                    title: undefined,
                },
            ])
        })
    })

    // eslint-disable-next-line arrow-body-style
    test('Returns an empty list if the store is empty', () => {
        return store.all().then((notes: Note[]) => {
            expect(notes).to.be.empty // eslint-disable-line
        })
    })

    test('Does not return directories', () => {
        notesDir.createDirectory('a-subdirectory')
        return store.all().then((notes: Note[]) => {
            expect(notes).to.be.empty // eslint-disable-line
        })
    })

    test('Ignores files matching ignore pattern', () => {
        store = new NoteStore(notesDir.path(), [/^ignored.*/])

        notesDir.createFile('note.md')
        notesDir.createFile('ignored-note.md')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf('note.md'),
                    fileRelativePath: 'note.md',
                    fileName: 'note.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note.md'),
                    tags: [],
                    title: undefined,
                },
            ])
        })
    })

    test('Ignores multiple files matching multiple ignore patterns', () => {
        store = new NoteStore(notesDir.path(), [/^ignored1.*/, /^ignored2.*/])

        notesDir.createFile('note.md')
        notesDir.createFile('ignored1.md')
        notesDir.createFile('ignored2.md')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf('note.md'),
                    fileRelativePath: 'note.md',
                    fileName: 'note.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note.md'),
                    tags: [],
                    title: undefined,
                },
            ])
        })
    })

    test('Applies ignore pattern to relative file paths', () => {
        store = new NoteStore(notesDir.path(), [/^subdir.*/])

        notesDir.createFileInDirectory('subdir', 'note.md')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([])
        })
    })

    test('Reads tags from a note', () => {
        notesDir.createFile('note.md', '---\ntags: [tag1, tag2]\n---')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf('note.md'),
                    fileRelativePath: 'note.md',
                    fileName: 'note.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note.md'),
                    tags: ['tag1', 'tag2'],
                    title: undefined,
                },
            ])
        })
    })

    test('Reads title from a note', () => {
        notesDir.createFile('note.md', '# title')

        return store.all().then((notes: Note[]) => {
            expect(notes).to.deep.equal([
                {
                    filePath: notesDir.pathOf('note.md'),
                    fileRelativePath: 'note.md',
                    fileName: 'note.md',
                    fileLastModifiedAt: notesDir.lastModifiedOf('note.md'),
                    tags: [],
                    title: 'title',
                },
            ])
        })
    })

    test('Reads content of the store when the store itself is a symlink to a directory', () => {
        const symlinkedNotesDir = new TestDirectory('symlinked-test-notes', { symlink: true })
        const symlinkedStore = new NoteStore(symlinkedNotesDir.path())

        symlinkedNotesDir.createFile('note.md', '---\ntags: [tag1, tag2]\n---')

        return symlinkedStore
            .all()
            .then((notes: Note[]) => {
                expect(notes).to.deep.equal([
                    {
                        filePath: symlinkedNotesDir.pathOf('note.md'),
                        fileRelativePath: 'note.md',
                        fileName: 'note.md',
                        fileLastModifiedAt: symlinkedNotesDir.lastModifiedOf('note.md'),
                        tags: ['tag1', 'tag2'],
                        title: undefined,
                    },
                ])
            })
            .finally(() => {
                symlinkedNotesDir.remove()
            })
    })
})
