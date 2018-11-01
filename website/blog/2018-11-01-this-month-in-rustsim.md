---
title: The last two months in rustsim #1
author: Sébastien Crozet
---

Welcome to the very first edition of _This month in rustsim_. This monthly newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org), [**ncollide**](https://ncollide.org), [**nalgebra**](https://nalgebra.org),
and [**alga**](https://github.com/rustsim/nalgebra) crate. This first posts will actually contain updates for the past
two months, that is, since the creation of the [**rustsim**](https://github.com/rustsim) github organization itself!

<!--truncate-->

# New communication channels
First and foremost new communication channel have been created:
* A new website for the rustsim organization where those newsletters will be hosted: https://rustsim.org.
* A new twitter account for the rustsim organization. You may follow this account to get more frequent update (that
is whenever something cool happens on either projects during the month): https://twitter.com/rustsim.
* Join us on our new Discord server where you can ask for help, provide feedbacks, and discuss the development of any project part of the rustsim
organization: https://discord.gg/vt9DJSW.

Of course, you can still ask for help and provide feedbacks on the user forum: https://discourse.nphysics.org.

# Progress of current developments
## Physics simulation of deformable bodies
Significant work is being done to add support for deformable bodies to **nphysics**. Current developments are happening
on the [deformable](https://github.com/rustsim/nphysics/tree/deformable) branch. You can already see
a few proofs of concept in the following videos:

1. A video for the simulation of a deformable beam based on a Finite Element Method (FEM).
2. A video for the simulation of a deformable triangle mesh based on a mass-spring model.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/mj6u4KuAH-w" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SJJSRgmiXh8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

<br/>
To achieve this, features are being added to crates other than **nphysics** too:

* **ncollide** is being improved to support **deformable triangle meshes**, that is, triangles meshes
that can be modified efficiently after their creation and addition to the world. This work is being
done on the [deformable](https://github.com/rustsim/ncollide/tree/deformable) branch.
* **nalgebra** is being improved to have a first limited support of **sparse matrices**. Right now, we
are working on supporting column-compressed matrices with multiplication, transposition, resolution of
triangular systems, and Cholesky
decomposition. This is motivated by the fact that a sparse Cholesky decomposition is needed by the
FEM-based deformation models to be efficient. Developments on this is happening on the
[sparse](https://github.com/rustsim/nalgebra/tree/sparse) branch.

## A new crate: nalgebra-glm
We have created a new crate for linear algebra: [**nalgebra-glm**](https://crates.io/crates/nalgebra-glm). See its documentation
[there](https://www.nalgebra.org/rustdoc_glm/nalgebra_glm/index.html). It also has a dedicated page on the
[user guide](https://www.nalgebra.org/nalgebra_glm/).

This crate is actually built on top of **nalgebra** to provide an alternative API which is designed to look
very much like the well-known C++ [GLM library](https://glm.g-truc.net). The goal of this initiative is to
provide to people that come from C++ an tool that looks like what they were already used to. Moreover, the
API of **nalgebra-glm** can be simpler to grasp than the one from **nalgebra** for some users or newcomers
that are more familiar with 4x4 matrices than with specific transformation types like `Isometry3` or `Similarity3`.

## A new crate: nphysics-ecs
With the [transition](https://github.com/amethyst/amethyst/pull/1066) of the [amethyst](https://www.amethyst.rs)
game engine from **cgmath** to **nalgebra**, we have started
collaborating with the amethyst community for making it simpler to integrate **nphysics** into
an ECS-based application. This will be done within the **nphysics-ecs** crate (which is currently empty)
with the precious help of [Rhuagh](https://github.com/Rhuagh) and [ldgoui](https://github.com/ldesgoui).

You can refer to the dedicated [issue](https://github.com/rustsim/nphysics/issues/149). Contributions are welcome!

## Documentation improvements
We are working on improving the rustdoc-generated documentation for all projects.
First, we are starting with the **nalgebra** and **nalgebra-glm** crates. Our goal is
to add `# Example` and `# See also` sections to all methods.

This has been started by [waywardmonkeys](https://github.com/waywardmonkeys) on github, huge thanks to him) on
nalgebra-glm crate; see for example the `glm::lerp` function [there](https://www.nalgebra.org/rustdoc_glm/nalgebra_glm/fn.lerp.html):

<center>
<img src="/img/blog/rustdoc_lerp.png" width="50%"></img>
</center>

We have been working on doing the same on **nalgebra** itself. So far, we started on
the addition of `# Example` sections to methods of geometric types. More will come in the
future.

# Thanks
We would like to thank the whole community and contributors. In particular:
* Thanks to [waywardmonkeys](https://github.com/waywardmonkeys) for his amazing work on the **nalgebra-glm** doc.
* Thanks to [jnferner](https://github.com/jnferner) for landing a large refactoring on **nphysics** addressing some
clippy warnings (see [nphysics#150](https://github.com/rustsim/nphysics/pull/150)), and for addressing issues regarding
the compatibility of **nphysics** with wasm-bindgen (see [nphysics#139](https://github.com/rustsim/nphysics/pull/139)).
* Thanks to [z33ky]() for his work on ncollide to avoid needless complexity on the `DBVTBroadPhase` implementation and to improve
the versatility of the `BroadPhase` trait. See [ncollide#225](https://github.com/rustsim/ncollide/pull/225) and
[ncollide#227](https://github.com/rustsim/ncollide/pull/227).
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users sharing their concerns regarding the API of some crates. We find feedbacks like [this](https://github.com/rustsim/nalgebra/issues/460)
or [that](https://discourse.nphysics.org/t/the-generated-documentation-can-be-very-confusing/269) very
valuable to improve the quality our work.

Finally, thanks to all the current and new patrons supporting this organization on [patreon](http://patreon.com/sebcrozet)!