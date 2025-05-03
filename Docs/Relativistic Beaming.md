# Relativistic Beaming in Black Hole Simulations

## What is Relativistic Beaming?

Relativistic beaming is a phenomenon that occurs when an object emitting light moves at speeds close to the speed of light. In the context of black hole accretion disks, the material in the disk orbits the black hole at relativistic speeds, especially near the event horizon. This causes the emitted light to be concentrated (beamed) in the direction of motion due to special relativistic effects.

## Visual Effect in the Simulation

- **Brighter Side:** The side of the accretion disk moving toward the observer appears significantly brighter and bluer. This is due to both Doppler boosting (increased intensity) and blueshift (shorter wavelength).
- **Dimmer Side:** The side moving away appears dimmer and redder, due to Doppler dimming and redshift.
- **Asymmetry:** The disk appears asymmetric, with a pronounced bright arc on the approaching side and a faint, redder arc on the receding side.

## How It's Implemented

- The simulation calculates the velocity of disk material at each point.
- The observed intensity is boosted by a factor depending on the velocity and the angle between the motion and the observer's line of sight.
- The color is shifted according to the relativistic Doppler effect.
- When the "Relativistic Beaming" option is enabled in the controls, these effects are applied to the disk rendering.

## Mathematical Details

The observed intensity $I_{\text{obs}}$ is related to the emitted intensity $I_{\text{em}}$ by:

$$
I_{\text{obs}} = I_{\text{em}} \cdot D^3
$$

where $D$ is the Doppler factor:

$$
D = \frac{1}{\gamma (1 - \beta \cos \theta)}
$$

- $\beta = v/c$ (velocity as a fraction of the speed of light)
- $\gamma = 1/\sqrt{1 - \beta^2}$ (Lorentz factor)
- $\theta$ is the angle between the velocity vector and the observer's line of sight

## References

- [Wikipedia: Relativistic beaming](https://en.wikipedia.org/wiki/Relativistic_beaming)
- [Black Hole Accretion Disks: Relativistic Effects](https://www.astro.umd.edu/~miller/teaching/astr498/lecture11.pdf)
- [Doppler Effect and Beaming in Astrophysics](https://ned.ipac.caltech.edu/level5/Sept04/Sikora/Sikora2_2.html)
