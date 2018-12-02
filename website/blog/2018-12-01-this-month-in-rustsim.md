---
title: This month in rustsim #2 (November 2018)
author: Sébastien Crozet
---

Welcome to the second edition of _This month in rustsim_. This monthly newsletter will provide you with a
summary of important update that occurred within the **rustsim** organization. This includes in particular updates about
the [**nphysics**](https://nphysics.org), [**ncollide**](https://ncollide.org), [**nalgebra**](https://nalgebra.org),
and [**alga**](https://github.com/rustsim/alga) crates.

<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW)!

# Progress of current developments
## Physics simulation of deformable bodies
The ongoing developments on the support of deformable bodies on **nphysics** continue steadily.
Those developments are still happening on the [deformable](https://github.com/rustsim/nphysics/tree/deformable) branch and
not published to [crates.io](https://crates.io) yet.

The newly implemented features are:

1. Simulations based on the finite-element methods (FEM) are now more stable due to the implementation of stiffness warping.
2. It is now possible to simulate **plasticity** with deformable bodies based on FEM. Plasticity is when an object suffers
   permanent deformations when it is subjected to a significant stress during a sufficiently long duration. See the first
   video bellow for a demo with and without plasticity.
3. Everything we have shown so far now works in 2D as well! See the second video bellow. Those features will be available in
   the **nphysics2d** crate in the future.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Qd1sxFG-2p0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/DRZccIrPppM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

## Improvements on ncollide
In the [deformable](https://github.com/rustsim/ncollide/tree/deformable) branch on ncollide, we are working on several
design improvements for code-reuse and for collision detection accuracy (those are not published on crates.io yet):

1. We are working on a brand-new collision-detection methods between two triangle meshes and two polygonal lines. Our
   goals is to be able to improve the handling of penetrations when a mesh (in 3D) or a polyline (in 2D) describe the
   boundary of a solid object.
2. The trait for [contact manifold generation](https://github.com/rustsim/ncollide/blob/deformable/src/pipeline/narrow_phase/contact_generator/contact_manifold_generator.rs#L14-L26) 
   has been improved to simplify code-reuse in the future. This will allow collision detection
   involving shapes like capsules and heightmaps to be implemented very easily and efficiently in the future.
3. Deformable polygonal lines are now [possible](https://github.com/rustsim/ncollide/blob/deformable/src/shape/polyline.rs#L477).
   Moreover, polygonal lines are now described with a buffer of indices as well as buffer of indices. This will allow the
   description of more complex shapes like the skeleton of trees with branches as well as closed loops. Before, only a simple continuous curve without
   loop was allowed.
   
## Improvements on nalgebra
We have continued our work on sparse matrix computations. In the
[sparse](https://github.com/rustsim/nalgebra/tree/sparse) branch, the following
operations (with tests) have been implemented based on a compressed column layout:

1. Multiplication and sum of two sparse matrices/vectors.
2. Lower-triangular system resolution with a right-hand-side vector that can be either sparse or dense.
3. Up-looking and left-looking Cholesky decompositions.

We are not using them in nphysics yet (for computations related to FEM) because the implemented Cholesky decompositions
still require very large systems to be significantly more efficient than our dense Cholesky implementation. We will be working on a
supernodal left-looking approach to improve those performances.

We have also significantly **improved the documentation** for geometric types (points, isometry, quaternions, etc.) by adding
doc-comments to almost all methods. Take a look at this by browsing the documentation [there](https://www.nalgebra.org/rustdoc/nalgebra/geometry/index.html)!
Those doc-tests will hopefully help understanding and discovering various features of **nalgebra**.


## Help wanted for the integration of a new crate: [space](https://github.com/vadixidav/space)!

We are working on integrating the new [space crate](https://github.com/vadixidav/space) maintained by [Geordon Worley](https://github.com/vadixidav)
to the rustsim organization. This crate aims to provide spacial data structures in pure-Rust and based on nalgebra. It is still at its
infancy as it only supports octrees based on morton keys right now. We also intend to migrate (from **ncollide** to **space**) spacial-partitioning structures like 
the [BVT](https://www.ncollide.org/rustdoc/ncollide3d/partitioning/struct.BVT.html) and [DBVT](https://www.ncollide.org/rustdoc/ncollide3d/partitioning/struct.DBVT.html) structures.

All this is transition is work-in progress and help would be very appreciated for improving the documentation and working
on this migration. Interested contributors will find more information on [that issue](https://github.com/vadixidav/space/issues/22).


# Thanks
We would like to thank the whole community and contributors. In particular:
* Thanks to [jswrenn](https://github.com/jswrenn) for his numerous contributions on nalgebra for converting a matrix to a `Vec` ([nalgebra#481](https://github.com/rustsim/nalgebra/pull/481)), adding matrix columns from a `Vec` ([nalgebra#468](https://github.com/rustsim/nalgebra/pull/468)), and adding swizzling to points ([nalgebra#483](https://github.com/rustsim/nalgebra/pull/483)).
* Thanks to [grtlr](https://github.com/grtlr) for adding a `.to_homogeneous()` methods to matrices to increase their dimension by 1 (see [nalgebra#475](https://github.com/rustsim/nalgebra/pull/475)).
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks, discuss features, and get assistance!

Finally, thanks to all the current and new patrons supporting the lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet)!