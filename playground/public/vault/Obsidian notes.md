---
title: Obsidian notes
description: A note read straight from an Obsidian vault, showing how the theme styles Obsidian's own syntax.
aliases: [Vault note]
---

This page is a plain `.md` file in `public/vault/`, rendered by `fumadocs-obsidian`. For the syntax itself, see [Obsidian Help](https://help.obsidian.md).

## Wikilinks

A link to [[#Callouts]], one with its own text: [[#Embeds|images in a note]], one through an alias: [[Vault note]], and one to a block: [[#^summary]].

A link to [[A note that does not exist]].

## Callouts

> [!note]
> A note callout.

> [!tip] Custom title
> A tip with its own title.

> [!info]
> An info callout.

> [!success]
> A success callout.

> [!question]
> A question callout.

> [!warning]
> A warning callout.

> [!danger]
> A danger callout.

> [!example]
> An example callout.

> [!quote]
> A quote callout.

> [!faq]- Folded until clicked
> A folding callout, closed at first.

> [!info] Nested
> A callout with another inside:
>
> > [!success]
> > The inner callout.

## Embeds

![[sample-diagram.svg]]

With a set width:

![[sample-diagram.svg|320]]

## Block references

A paragraph with a block ID, which the link at the top of the page points to. ^summary

## Comments

The next sentence is a comment and does not appear on the site. %%This text is hidden.%% The text continues after it.

## Highlights and tags

==Highlighted text==, and tags: #aws #networking.

## Task states

- [ ] Not started
- [x] Done
- [/] In progress
- [-] Cancelled
