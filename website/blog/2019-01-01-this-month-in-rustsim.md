---
title: This month in rustsim #3 (December 2018)
author: Sébastien Crozet
---

**Happy new year everyone!**

Welcome to the third edition of _This month in rustsim_. This monthly newsletter will provide you with a
summary of important update that occurred within the **rustsim** organization. This includes in particular updates about
the [**nphysics**](https://nphysics.org), [**ncollide**](https://ncollide.org), [**nalgebra**](https://nalgebra.org),
and [**alga**](https://github.com/rustsim/alga) crates.

<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW)!
Join us on our [user forum](https://discourse.nphysics.org )!

# Release date: february 3rd 2019
During the path few months, we described several new unreleased features in **ncollide** and **nphysics** (in particular related
to deformable bodies). This month's issue also describes ongoing developments which are not released yet.
All this will be released february 3rd 2019! Here is a summary of the major new features you will get:


**nphysics2d and nphysics3d v0.19:**

1. Support of three different kinds of deformable bodies using three different models: constraints-based,
mass-spring based, FEM-based.
2. Support of using heightmaps and capsules as shapes.
3. Simpler ways (using the builder pattern) of creating a rigid-body, multibody, deformable bodies, and colliders.
4. User-data associated to bodies.

**ncollide2d and ncollide3d v0.18:**

1. Support for collision objects with a shape that can change after it has been added to the collision world.
This includes modifying the vertices of a `TriMesh` or a `Polyline`.
2. Support of heightmap and capsule shapes (more about this later in this post).
    
**nalgebra v0.17:**

1. New range-based indexing methods. For example this will allow you to write `matrix.get(4, 5..9)` to extract as a
vector the rows 5 to 9 of the column at index 4. See the [PR from jswrenn](https://github.com/rustsim/nalgebra/pull/490)
for more details.
2. All the incremental improvements made since the version 16.0. See the full list on the
[changelog](https://github.com/rustsim/nalgebra/blob/master/CHANGELOG.md#0170---wip).

The goal of january 2019 will be to clean things up for this release. Note that updates of the online user-guide will not
be released the 3rd of february but all examples on the github repo. will be updated.

# Goals for 2019
Here are our main goals for the year 2019:

**nphysics:**

1. Add support for fluid dynamics based on SPH (Smoothed Particle Hydrodynamics).
2. Re-implement CCD (Continuous Collision Detection) support.
3. Improve overall performances by leveraging SIMD and optional parallelism.
4. Work with the [amethyst](https://www.amethyst.rs/) community to make **nphysics** easier to integrate to their game engine (and ECS in general).
Note that they have already started some great work regarding this integration by creating the work-in-progress crate:
[nphysics-ecs-dumb](https://github.com/distransient/nphysics-ecs-dumb) (kudos to [distransient](https://github.com/distransient) and [jojolepro](https://github.com/jojolepro)!)

**ncollide:**

The main goal of **ncollide** will be to include whatever change is necessary for **nphysics** to achieve its goal.
In particular improvements are to be expected for:

1. Computation of time-of-impact between moving shapes.
2. Improvement of the broad-phase.
3. Addition of a new deformable geometry described as a set of spheres that will be used for fluid particles.

**nalgebra:**

1. Performance improvements using SIMD (see [that issue](https://github.com/rustsim/nalgebra/issues/502)).
2. Better complex number support by improving some abstractions on the **alga** crate.
3. Basic sparse matrix support by polishing and completing the work done in the [sparse](https://github.com/rustsim/nalgebra/tree/sparse) branch. 

We will also work in porting the [rusty-machine](https://github.com/AtheMathmo/rusty-machine) crate to **nalgebra** and
transfer it to the rustsim organization as
discussed on [that issue](https://github.com/AtheMathmo/rusty-machine/issues/199#issuecomment-445384908).
Our goal is to offer a steadier maintenance level as well as communication tools (discord and user-forum) so this
great crate remains available and useful to the community in a long term.
We have already started adding some feature missing from **nalgebra** to achieve this migration. See [that PR](https://github.com/rustsim/nalgebra/pull/499).

# Progress of current developments
## Improvements on nphysics
The ongoing developments on the support of deformable bodies on **nphysics** continue steadily.
Those developments are still happening on the [deformable](https://github.com/rustsim/nphysics/tree/deformable) branch and
not published to [crates.io](https://crates.io) yet.

The two last necessary features have been implemented:

1. Support for points of deformable bodies with a fixed position in space so you can attach a deformable body to the ground with no additional computational cost.
See the first video bellow.
2. Support for constraints-based joints on multibodies. This allows you to attach a deformable body to any other kind
of body using, for example, a `BallConstraint`, a `FixedConstraint`. See the second video bellow.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/KEt14fhsFnw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/oWFHogFH14E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

## Improvements on ncollide
In the [deformable](https://github.com/rustsim/ncollide/tree/deformable) branch on ncollide, we added:

1. Full support of the `Capsule` shape so you can use it for contact determination.
2. Support for the `Heightfield` shape (aka. heigthmaps). Almost everything is implemented (including collision detection). The only missing
part is the computation of point-projection. It is possible to define holes in the heightmap by indicating which triangles of which squares
are to be ignored.

The following video shows the use of both the `Capsule` and `Heightfield` shape within **nphysics3d** and **nphysics2d**:

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/FGpIaQdvmKo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>
   
## Improvements on nalgebra
Two significant contributions were made to **nalgebra** and **nalgebra-glm**:

1. A new matrix indexing method has been implemented by [jswrenn](https://github.com/jswrenn). This makes it easier to
extract a slice of a matrix using range notation. Details and examples can be found [there](https://github.com/rustsim/nalgebra/pull/490).
2. Implementation of most variants of perspective and orthographic projections have been added to **nalgebra-glm** by [MindSpunk](https://github.com/nathanvoglsam).
See [that PR](https://github.com/rustsim/nalgebra/pull/505) for details on what functions have been added (note that the Cargo features
proposed in the PR description have not been merged).

# Thanks
We would like to thank the whole community and contributors. In particular:

* Thanks to [jswrenn](https://github.com/jswrenn) for his numerous contributions on nalgebra, including the great addition of the new indexing method.
* Thanks to [MindSpunk](https://github.com/nathanvoglsam) for implementing all the variants of orthographic and perspective projection on nalgebra-glm.
* Thanks to all the other contributors not mentioned explicitly on this list.
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks, discuss features, and get assistance!

Finally, thanks to all the current and new patrons supporting the lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet)!